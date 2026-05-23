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
    private readonly BonusTransactionService _bonusTransactionService;
    private readonly AppDbContext _context;

    private const decimal BONUS_PERCENT = 0.05m; // 5% bonus accrual

    public OrderService(
        OrderRepository orderRepository,
        OrderItemRepository orderItemRepository,
        CartItemRepository cartItemRepository,
        UserRepository userRepository,
        BonusTransactionService bonusTransactionService,
        AppDbContext context)
    {
        _orderRepository = orderRepository;
        _orderItemRepository = orderItemRepository;
        _cartItemRepository = cartItemRepository;
        _userRepository = userRepository;
        _bonusTransactionService = bonusTransactionService;
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

    public async Task<List<OrderDto>> GetUserActiveOrdersAsync(int userId, string[] statuses)
    {
        var orders = await _orderRepository
            .GetUserActiveOrdersAsync(userId, statuses);

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

    public async Task<OrderDto> CreateOrderFromCartAsync(int userId, CreateOrderDto createDto)
    {
        // Get user
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception($"User with id {userId} not found");

        // Get cart items
        var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
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
        decimal bonusEarned = 0;

        if (bonusToUse <= 0)
        {
            bonusEarned = Math.Floor(finalPrice * BONUS_PERCENT);
        }

        // Create order
        var order = new Order
        {
            UserId = userId,
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

        order.OrderNumber = 1000 + order.Id;

        _orderRepository.Update(order);
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
                userId,
                order.Id,
                bonusToUse,
                $"Списание {bonusToUse} бонусов за заказ #{order.Id}");
        }

        // Clear cart
        await _cartItemRepository.ClearUserCartAsync(userId);
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto?> UpdateOrderStatusAsync(int orderId, string status, string? baristaComment = null)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null)
            return null;

        var validStatuses = new[] { "pending", "confirmed", "paid", "preparing", "ready", "completed", "cancelled", "rejected", "notPickedUp", "refunded" };
        if (!validStatuses.Contains(status))
            throw new Exception($"Invalid status '{status}'");

        order.Status = status;
        if (baristaComment != null)
            order.BaristaComment = baristaComment;

        _orderRepository.Update(order);

        if (status == "completed" && order.BonusEarned > 0)
        {
            await _bonusTransactionService.AccrueBonusesAsync(
                order.UserId,
                order.Id,
                order.BonusEarned);
        }

        if (status == "refunded")
        {
            if (order.BonusEarned > 0)
            {
                await _bonusTransactionService.RevertAccrualBonusesAsync(
                    order.UserId,
                    order.Id,
                    order.BonusEarned);
            }

            if (order.BonusUsed > 0)
            {
                await _bonusTransactionService.RevertRedeemBonusesAsync(
                    order.UserId,
                    order.Id,
                    order.BonusUsed);
            }

            order.BonusEarned = 0;
            order.BonusUsed = 0;
        }


        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    public async Task<OrderDto?> Cancel(int orderId)
    {
        var order = await _orderRepository.GetByIdAsync(orderId);
        if (order == null) return null;

        var cancellableStatuses = new[] { "pending", "confirmed" };

        if (!cancellableStatuses.Contains(order.Status)) throw new Exception($"Order with status '{order.Status}' cannot be cancelled");

        if (order.BonusUsed > 0)
        {
            await _bonusTransactionService.RevertRedeemBonusesAsync(
                order.UserId,
                order.Id,
                order.BonusUsed);
        }

        if (order.BonusEarned > 0)
        {
            await _bonusTransactionService.RevertAccrualBonusesAsync(
                order.UserId,
                order.Id,
                order.BonusEarned);
        }

        order.BonusEarned = 0;
        order.BonusUsed = 0;
        order.Status = "cancelled";

        _orderRepository.Update(order);
        await _context.SaveChangesAsync();

        return MapToDto(order);
    }

    private OrderDto MapToDto(Order order)
    {
        return new OrderDto
        {
            Id = order.Id,
            UserId = order.UserId,
            UserName = order.User?.Username ?? string.Empty,
            Email = order.User?.Email ?? string.Empty,
            Status = order.Status,
            TotalPrice = order.TotalPrice,
            BonusUsed = order.BonusUsed,
            BonusEarned = order.BonusEarned,
            PickupTime = order.PickupTime,
            BaristaComment = order.BaristaComment,
            ClientComment = order.ClientComment,
            CreatedAt = order.CreatedAt,
            OrderNumber = order.OrderNumber,
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
