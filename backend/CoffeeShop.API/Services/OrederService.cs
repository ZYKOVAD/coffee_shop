using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using System.Text.Json;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class OrderService
{
    private readonly OrderRepository _orderRepository;
    private readonly OrderItemRepository _orderItemRepository;
    private readonly CartItemRepository _cartItemRepository;
    private readonly UserRepository _userRepository;
    private readonly ProductRepository _productRepository;
    private readonly BonusTransactionService _bonusTransactionService;
    private readonly NotificationService _notificationService;
    private readonly AppDbContext _context;

    private const decimal BONUS_PERCENT = 0.05m; // 5% bonus accrual

    public OrderService(
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        CartItemRepository cartItemRepository,
        UserRepository userRepository,
        ProductRepository productRepository,
        BonusTransactionService bonusTransactionService,
        NotificationService notificationService,
        AppDbContext context)
    {
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _cartItemRepository = cartItemRepository;
        _userRepository = userRepository;
        _productRepository = productRepository;
        _bonusTransactionService = bonusTransactionService;
        _notificationService = notificationService;
        _context = context;
    }

    public async Task<List<OrderDto>> GetAllOrdersAsync()
    {
        var orders = await _orderRepository.GetAllAsync();
        return orders.Select(o => MapToDto(o)).ToList();
    }

    public async Task<OrderDto?> GetOrderByIdAsync(int id)
    {
        var order = await _orderRepository.GetByIdAsync(id);
        return order == null ? null : MapToDto(order);
    }

    public async Task<List<OrderDto>> GetUserOrdersAsync(int userId)
    {
        var orders = await _orderRepository.GetByUserIdAsync(userId);
        return orders.Select(o => MapToDto(o)).ToList();
    }

    public async Task<List<OrderDto>> GetOrdersByStatusAsync(string status)
    {
        var orders = await _orderRepository.GetByStatusAsync(status);
        return orders.Select(o => MapToDto(o)).ToList();
    }

    public async Task<List<OrderDto>> GetPendingOrdersForBaristaAsync()
    {
        var orders = await _orderRepository.GetPendingOrdersForBaristaAsync();
        return orders.Select(o => MapToDto(o)).ToList();
    }

    public async Task<OrderDto> CreateOrderFromCartAsync(CreateOrderDto createDto)
    {
        // Get user
        var user = await _userRepository.GetByIdAsync(createDto.UserId);
        if (user == null)
            throw new Exception($"User with id {createDto.UserId} not found");

        // Get cart items
        var cartItems = await _cartItemRepository.GetByUserIdAsync(createDto.UserId);
        if (!cartItems.Any())
            throw new Exception("Cart is empty");

        // Calculate totals
        decimal subtotal = 0;
        var orderItems = new List<OrderItem>();

        foreach (var cartItem in cartItems)
        {
            var product = cartItem.Product;
            var itemTotal = product.Price * cartItem.Count;
            subtotal += itemTotal;

            // Parse modifiers to calculate their total
            var modifiers = JsonSerializer.Deserialize<List<JsonElement>>(cartItem.SelectedModifiers) ?? new List<JsonElement>();
            decimal modifiersTotal = modifiers.Sum(m =>
                m.TryGetProperty("price", out var price) ? price.GetDecimal() * cartItem.Count : 0);

            var orderItem = new OrderItem
            {
                ProductId = cartItem.ProductId,
                ProductName = product.Name,
                Count = cartItem.Count,
                Price = product.Price,
                SelectedModifiers = cartItem.SelectedModifiers,
                TotalPrice = itemTotal + modifiersTotal
            };
            orderItems.Add(orderItem);
        }

        decimal totalPrice = orderItems.Sum(oi => oi.TotalPrice);

        // Apply bonus usage
        decimal bonusToUse = createDto.BonusToUse;
        if (bonusToUse > user.BonusBalance)
            bonusToUse = user.BonusBalance;
        if (bonusToUse > totalPrice)
            bonusToUse = totalPrice;

        decimal finalPrice = totalPrice - bonusToUse;
        decimal bonusEarned = Math.Floor(totalPrice * BONUS_PERCENT);

        // Create order
        var order = new Order
        {
            UserId = createDto.UserId,
            Status = "pending",
            TotalPrice = finalPrice,
            BonusUsed = bonusToUse,
            BonusEarned = bonusEarned,
            PickupTime = createDto.PickupTime,
            ClientComment = createDto.ClientComment,
            CreatedAt = DateTime.UtcNow
        };

        await _orderRepository.AddAsync(order);
        await _context.SaveChangesAsync();

        // Add order items
        foreach (var item in orderItems)
        {
            item.OrderId = order.Id;
            await _orderItemRepository.AddAsync(item);
        }

        // Process bonus redemption
        if (bonusToUse > 0)
        {
            await _bonusTransactionService.RedeemBonusesAsync(
                createDto.UserId,
                order.Id,
                bonusToUse,
                $"Списание {bonusToUse} бонусов за заказ #{order.Id}");
        }

        // Clear cart
        await _cartItemRepository.ClearUserCartAsync(createDto.UserId);
        await _context.SaveChangesAsync();

        // Create notification
        await _notificationService.CreateOrderStatusNotificationAsync(
            createDto.UserId,
            order.Id,
            "pending",
            "Ваш заказ создан и ожидает подтверждения бариста");

        return MapToDto(order);
    }

    public async Task<OrderDto?> ConfirmOrderByBaristaAsync(int orderId, string? comment)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return null;

        if (order.Status != "pending")
            throw new Exception($"Order cannot be confirmed from status '{order.Status}'");

        order.Status = "confirmed";
        order.BaristaComment = comment;

        _orderRepository.Update(order);
        await _context.SaveChangesAsync();

        // Create notification for user
        await _notificationService.CreateOrderStatusNotificationAsync(
            order.UserId,
            order.Id,
            "confirmed",
            comment ?? "Ваш заказ подтвержден. Ожидайте оплаты.");

        return MapToDto(order);
    }

    public async Task<OrderDto?> RejectOrderByBaristaAsync(int orderId, string comment)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return null;

        if (order.Status != "pending")
            throw new Exception($"Order cannot be rejected from status '{order.Status}'");

        order.Status = "rejected";
        order.BaristaComment = comment;

        _orderRepository.Update(order);
        await _context.SaveChangesAsync();

        // Create notification for user
        await _notificationService.CreateOrderStatusNotificationAsync(
            order.UserId,
            order.Id,
            "rejected",
            comment);

        return MapToDto(order);
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string status, string? comment = null)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return null;

        var validStatuses = new[] { "confirmed", "paid", "preparing", "ready", "completed", "cancelled" };
        if (!validStatuses.Contains(status))
            throw new Exception($"Invalid status '{status}'");

        order.Status = status;
        if (comment != null)
            order.BaristaComment = comment;

        _orderRepository.Update(order);

        // If order is completed, accrue bonuses
        if (status == "completed" && order.BonusEarned > 0)
        {
            await _bonusTransactionService.AccrueBonusesAsync(
                order.UserId,
                order.Id,
                order.BonusEarned,
                $"Начисление {order.BonusEarned} бонусов за заказ #{order.Id}");
        }

        await _context.SaveChangesAsync();

        // Create notification for user
        var message = GetStatusMessage(status);
        await _notificationService.CreateOrderStatusNotificationAsync(
            order.UserId,
            order.Id,
            status,
            message);

        return MapToDto(order);
    }

    public async Task<OrderDto?> MarkAsPaidAsync(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return null;

        if (order.Status != "confirmed")
            throw new Exception($"Order cannot be paid from status '{order.Status}'");

        order.Status = "paid";

        _orderRepository.Update(order);
        await _context.SaveChangesAsync();

        await _notificationService.CreateOrderStatusNotificationAsync(
            order.UserId,
            order.Id,
            "paid",
            "Заказ оплачен. Бариста приступит к приготовлению.");

        return MapToDto(order);
    }

    private string GetStatusMessage(string status)
    {
        return status switch
        {
            "confirmed" => "Заказ подтвержден",
            "paid" => "Заказ оплачен",
            "preparing" => "Заказ готовится",
            "ready" => "Заказ готов к выдаче",
            "completed" => "Заказ выполнен. Спасибо за покупку!",
            "cancelled" => "Заказ отменен",
            _ => $"Статус заказа изменен на {status}"
        };
    }


    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            UserName = order.User?.Username ?? string.Empty,
            Status = order.Status,
            TotalPrice = order.TotalPrice,
            BonusUsed = order.BonusUsed,
            BonusEarned = order.BonusEarned,
            PickupTime = order.PickupTime,
            BaristaComment = order.BaristaComment,
            ClientComment = order.ClientComment,
            CreatedAt = order.CreatedAt,
            Items = order.OrderItems?.Select(oi => new OrderItemDto
            {
                Id = oi.Id,
                OrderId = oi.OrderId,
                ProductId = oi.ProductId,
                ProductName = oi.ProductName,
                Count = oi.Count,
                Price = oi.Price,
                TotalPrice = oi.TotalPrice,
                SelectedModifiers = oi.SelectedModifiers
            }).ToList() ?? new List<OrderItemDto>()
        };
    }
}
