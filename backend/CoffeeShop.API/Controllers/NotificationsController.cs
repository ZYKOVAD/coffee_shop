using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly NotificationService _notificationService;

    public NotificationsController(NotificationService notificationService)
    {
        _notificationService = notificationService;
    }

    [HttpGet]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> GetAll()
    {
        var notifications = await _notificationService.GetAllNotificationsAsync();
        return Ok(notifications);
    }

    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var notification = await _notificationService.GetNotificationByIdAsync(id);
        if (notification == null)
            return NotFound(new { message = $"Notification with id {id} not found" });
        return Ok(notification);
    }

    [HttpGet("user/{userId}")]
    [Authorize]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var notifications = await _notificationService.GetUserNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpGet("user/{userId}/unread")]
    [Authorize]
    public async Task<IActionResult> GetUnread(int userId)
    {
        var notifications = await _notificationService.GetUnreadNotificationsAsync(userId);
        return Ok(notifications);
    }

    [HttpGet("user/{userId}/unread/count")]
    [Authorize]
    public async Task<IActionResult> GetUnreadCount(int userId)
    {
        var count = await _notificationService.GetUnreadCountAsync(userId);
        return Ok(new { userId, unreadCount = count });
    }

    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateNotificationDto createDto)
    {
        try
        {
            var notification = await _notificationService.CreateNotificationAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = notification.Id }, notification);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPut("{id}/read")]
    [Authorize]
    public async Task<IActionResult> MarkAsRead(int id)
    {
        var notification = await _notificationService.MarkAsReadAsync(id);
        if (notification == null)
            return NotFound(new { message = $"Notification with id {id} not found" });
        return Ok(notification);
    }

    [HttpPut("user/{userId}/read-all")]
    [Authorize]
    public async Task<IActionResult> MarkAllAsRead(int userId)
    {
        await _notificationService.MarkAllAsReadAsync(userId);
        return Ok(new { message = "All notifications marked as read" });
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _notificationService.DeleteNotificationAsync(id);
        if (!result)
            return NotFound(new { message = $"Notification with id {id} not found" });
        return NoContent();
    }
}