using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class OrdersController : ControllerBase
{
    private readonly OrderService _orderService;

    public OrdersController(OrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = GetCurrentUserId();
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpGet("me/active")]
    public async Task<IActionResult> GetMyActiveOrders()
    {
        var userId = GetCurrentUserId();

        var activeStatuses = new[]
        {
        "pending",
        "confirmed",
        "paid",
        "preparing",
        "ready"
    };

        var orders = await _orderService.GetUserActiveOrdersAsync(
            userId,
            activeStatuses);

        return Ok(orders);
    }

    [HttpGet]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> GetAll()
    {
        var orders = await _orderService.GetAllOrdersAsync();
        return Ok(orders);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var order = await _orderService.GetOrderByIdAsync(id);
        if (order == null)
            return NotFound(new { message = $"Order with id {id} not found" });
        return Ok(order);
    }

    [HttpGet("user/{userId}")]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var orders = await _orderService.GetUserOrdersAsync(userId);
        return Ok(orders);
    }

    [HttpGet("status/{status}")]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> GetByStatus(string status)
    {
        var orders = await _orderService.GetOrdersByStatusAsync(status);
        return Ok(orders);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderDto createDto)
    {
        try
        {
            var userId = GetCurrentUserId();

            var order = await _orderService.CreateOrderFromCartAsync(userId, createDto);
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{orderId}/status")]
    public async Task<IActionResult> UpdateStatus(int orderId, [FromBody] UpdateOrderStatusDto updateDto)
    {
        try
        {
            var order = await _orderService.UpdateOrderStatusAsync(orderId, updateDto.Status, updateDto.BaristaComment);
            if (order == null)
                return NotFound(new { message = $"Order with id {orderId} not found" });
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{orderId}/cancel")]
    public async Task<IActionResult> Cancel(int orderId)
    {
        try
        {
            var order = await _orderService.Cancel(orderId);
            if (order == null) return NotFound(new { message = $"Order with id {orderId} not found" });
            return Ok(order);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
}