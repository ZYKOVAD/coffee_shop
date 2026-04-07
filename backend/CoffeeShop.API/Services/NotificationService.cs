using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class NotificationService
{
    private readonly NotificationRepository _notificationRepository;
    private readonly UserRepository _userRepository;
    private readonly AppDbContext _context;

    public NotificationService(
        NotificationRepository notificationRepository,
        UserRepository userRepository,
        AppDbContext context)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
        _context = context;
    }

    public async Task<List<NotificationDto>> GetAllNotificationsAsync()
    {
        var notifications = await _notificationRepository.GetAllAsync();
        return notifications.Select(n => MapToDto(n)).ToList();
    }

    public async Task<NotificationDto?> GetNotificationByIdAsync(int id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id);
        return notification == null ? null : MapToDto(notification);
    }

    public async Task<List<NotificationDto>> GetUserNotificationsAsync(int userId)
    {
        var notifications = await _notificationRepository.GetByUserIdAsync(userId);
        return notifications.Select(n => MapToDto(n)).ToList();
    }

    public async Task<List<NotificationDto>> GetUnreadNotificationsAsync(int userId)
    {
        var notifications = await _notificationRepository.GetUnreadByUserIdAsync(userId);
        return notifications.Select(n => MapToDto(n)).ToList();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _notificationRepository.GetUnreadCountAsync(userId);
    }

    public async Task<NotificationDto> CreateNotificationAsync(CreateNotificationDto createDto)
    {
        var user = await _userRepository.GetByIdAsync(createDto.UserId);
        if (user == null)
            throw new Exception($"User with id {createDto.UserId} not found");

        var notification = new Notification
        {
            UserId = createDto.UserId,
            Title = createDto.Title,
            Body = createDto.Body,
            Type = createDto.Type,
            IsRead = false,
            CreatedAt = DateTime.UtcNow
        };

        await _notificationRepository.AddAsync(notification);
        await _context.SaveChangesAsync();

        return MapToDto(notification);
    }

    public async Task<NotificationDto?> MarkAsReadAsync(int id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id);
        if (notification == null)
            return null;

        notification.IsRead = true;
        _notificationRepository.Update(notification);
        await _context.SaveChangesAsync();

        return MapToDto(notification);
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        await _notificationRepository.MarkAllAsReadAsync(userId);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> DeleteNotificationAsync(int id)
    {
        var notification = await _notificationRepository.GetByIdAsync(id);
        if (notification == null)
            return false;

        _notificationRepository.Delete(notification);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task CreateOrderStatusNotificationAsync(int userId, int orderId, string status, string message)
    {
        var notification = new CreateNotificationDto
        {
            UserId = userId,
            Title = $"Заказ #{orderId} - {GetStatusName(status)}",
            Body = message,
            Type = "order_status"
        };
        await CreateNotificationAsync(notification);
    }

    private string GetStatusName(string status)
    {
        return status switch
        {
            "pending" => "Ожидает подтверждения",
            "confirmed" => "Подтвержден",
            "paid" => "Оплачен",
            "preparing" => "Готовится",
            "ready" => "Готов к выдаче",
            "completed" => "Выдан",
            "cancelled" => "Отменен",
            "rejected" => "Отказ",
            _ => status
        };
    }

    private NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.UserId,
            Title = notification.Title,
            Body = notification.Body,
            Type = notification.Type,
            IsRead = notification.IsRead,
            CreatedAt = notification.CreatedAt
        };
    }
}