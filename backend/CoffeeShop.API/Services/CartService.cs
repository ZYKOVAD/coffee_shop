using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using System.Text.Json;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class CartService
{
    private readonly CartItemRepository _cartItemRepository;
    private readonly UserRepository _userRepository;
    private readonly ProductRepository _productRepository;
    private readonly AppDbContext _context;

    public CartService(
        CartItemRepository cartItemRepository,
        UserRepository userRepository,
        ProductRepository productRepository,
        AppDbContext context)
    {
        _cartItemRepository = cartItemRepository;
        _userRepository = userRepository;
        _productRepository = productRepository;
        _context = context;
    }

    public async Task<List<CartItemDto>> GetUserCartAsync(int userId)
    {
        var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
        return cartItems.Select(ci => MapToDto(ci)).ToList();
    }

    public async Task<CartItemDto?> AddToCartAsync(int userId, AddToCartDto addDto)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception($"User with id {userId} not found");

        var product = await _productRepository.GetByIdAsync(addDto.ProductId);
        if (product == null)
            throw new Exception($"Product with id {addDto.ProductId} not found");

        if (!product.IsActive)
            throw new Exception($"Product '{product.Name}' is not available");

        // Check if same item with same modifiers already exists in cart
        var existingItem = await _cartItemRepository.GetByUserAndProductAsync(
            userId, addDto.ProductId, addDto.SelectedModifiers);

        if (existingItem != null)
        {
            // Update quantity
            existingItem.Count += addDto.Count;
            _cartItemRepository.Update(existingItem);
        }
        else
        {
            // Add new item
            var cartItem = new CartItem
            {
                UserId = userId,
                ProductId = addDto.ProductId,
                Count = addDto.Count,
                SelectedModifiers = addDto.SelectedModifiers
            };
            await _cartItemRepository.AddAsync(cartItem);
        }

        await _context.SaveChangesAsync();

        // Return updated cart item
        var updatedItem = await _cartItemRepository.GetByUserAndProductAsync(
            userId, addDto.ProductId, addDto.SelectedModifiers);

        return updatedItem == null ? null : MapToDto(updatedItem);
    }

    public async Task<CartItemDto?> UpdateCartItemAsync(int cartItemId, UpdateCartItemDto updateDto)
    {
        var cartItem = await _cartItemRepository.GetByIdAsync(cartItemId);
        if (cartItem == null)
            return null;

        if (updateDto.Count <= 0)
        {
            // Remove item if count is 0 or negative
            await RemoveFromCartAsync(cartItemId);
            return null;
        }

        cartItem.Count = updateDto.Count;

        if (!string.IsNullOrEmpty(updateDto.SelectedModifiers))
            cartItem.SelectedModifiers = updateDto.SelectedModifiers;

        _cartItemRepository.Update(cartItem);
        await _context.SaveChangesAsync();

        return MapToDto(cartItem);
    }

    public async Task<bool> RemoveFromCartAsync(int cartItemId)
    {
        var cartItem = await _cartItemRepository.GetByIdAsync(cartItemId);
        if (cartItem == null)
            return false;

        _cartItemRepository.Delete(cartItem);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task ClearCartAsync(int userId)
    {
        await _cartItemRepository.ClearUserCartAsync(userId);
        await _context.SaveChangesAsync();
    }

    public async Task<int> GetCartCountAsync(int userId)
    {
        return await _cartItemRepository.GetCartCountAsync(userId);
    }

    public async Task<decimal> GetCartTotalAsync(int userId)
    {
        var cartItems = await _cartItemRepository.GetByUserIdAsync(userId);
        decimal total = 0;

        foreach (var item in cartItems)
        {
            var modifiers = JsonSerializer.Deserialize<List<JsonElement>>(item.SelectedModifiers) ?? new List<JsonElement>();
            decimal modifiersTotal = modifiers.Sum(m =>
                m.TryGetProperty("price", out var price) ? price.GetDecimal() * item.Count : 0);

            total += (item.Product.Price * item.Count) + modifiersTotal;
        }

        return total;
    }

    private CartItemDto MapToDto(CartItem cartItem)
    {
        decimal modifiersTotal = 0;
        var modifiers = JsonSerializer.Deserialize<List<JsonElement>>(cartItem.SelectedModifiers) ?? new List<JsonElement>();

        foreach (var modifier in modifiers)
        {
            if (modifier.TryGetProperty("price", out var price))
                modifiersTotal += price.GetDecimal() * cartItem.Count;
        }

        return new CartItemDto
        {
            Id = cartItem.Id,
            ProductId = cartItem.ProductId,
            ProductName = cartItem.Product?.Name ?? string.Empty,
            ProductPrice = cartItem.Product?.Price ?? 0,
            Count = cartItem.Count,
            SelectedModifiers = cartItem.SelectedModifiers,
            TotalPrice = (cartItem.Product?.Price ?? 0) * cartItem.Count + modifiersTotal
        };
    }
}