using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly CartService _cartService;

    public CartController(CartService cartService)
    {
        _cartService = cartService;
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetUserCart(int userId)
    {
        var cart = await _cartService.GetUserCartAsync(userId);
        return Ok(cart);
    }

    [HttpGet("user/{userId}/count")]
    public async Task<IActionResult> GetCartCount(int userId)
    {
        var count = await _cartService.GetCartCountAsync(userId);
        return Ok(new { userId, itemCount = count });
    }

    [HttpGet("user/{userId}/total")]
    public async Task<IActionResult> GetCartTotal(int userId)
    {
        var total = await _cartService.GetCartTotalAsync(userId);
        return Ok(new { userId, total });
    }

    [HttpPost("user/{userId}/add")]
    public async Task<IActionResult> AddToCart(int userId, [FromBody] AddToCartDto addDto)
    {
        try
        {
            var cartItem = await _cartService.AddToCartAsync(userId, addDto);
            if (cartItem == null)
                return BadRequest(new { message = "Failed to add item to cart" });
            return Ok(cartItem);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(int cartItemId, [FromBody] UpdateCartItemDto updateDto)
    {
        var cartItem = await _cartService.UpdateCartItemAsync(cartItemId, updateDto);
        if (cartItem == null)
            return NotFound(new { message = $"Cart item with id {cartItemId} not found" });
        return Ok(cartItem);
    }

    [HttpDelete("{cartItemId}")]
    public async Task<IActionResult> RemoveFromCart(int cartItemId)
    {
        var result = await _cartService.RemoveFromCartAsync(cartItemId);
        if (!result)
            return NotFound(new { message = $"Cart item with id {cartItemId} not found" });
        return NoContent();
    }

    [HttpDelete("user/{userId}/clear")]
    public async Task<IActionResult> ClearCart(int userId)
    {
        await _cartService.ClearCartAsync(userId);
        return Ok(new { message = "Cart cleared successfully" });
    }
}