using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class NotificationRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<Notification> _dbSet;

    public NotificationRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<Notification>();
    }

    public async Task<List<Notification>> GetAllAsync()
    {
        return await _dbSet
            .Include(n => n.User)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<Notification?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(n => n.User)
            .FirstOrDefaultAsync(n => n.Id == id);
    }

    public async Task<List<Notification>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Notification>> GetUnreadByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(n => n.UserId == userId && !n.IsRead)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync();
    }

    public async Task<int> GetUnreadCountAsync(int userId)
    {
        return await _dbSet.CountAsync(n => n.UserId == userId && !n.IsRead);
    }

    public async Task AddAsync(Notification notification)
    {
        await _dbSet.AddAsync(notification);
    }

    public void Update(Notification notification)
    {
        _dbSet.Update(notification);
    }

    public void Delete(Notification notification)
    {
        _dbSet.Remove(notification);
    }

    public async Task MarkAsReadAsync(int id)
    {
        var notification = await GetByIdAsync(id);
        if (notification != null)
        {
            notification.IsRead = true;
            Update(notification);
        }
    }

    public async Task MarkAllAsReadAsync(int userId)
    {
        var notifications = await _dbSet
            .Where(n => n.UserId == userId && !n.IsRead)
            .ToListAsync();

        foreach (var notification in notifications)
        {
            notification.IsRead = true;
        }
    }

    public async Task DeleteOldNotificationsAsync(int daysOld = 30)
    {
        var cutoffDate = DateTime.UtcNow.AddDays(-daysOld);
        var oldNotifications = await _dbSet
            .Where(n => n.CreatedAt < cutoffDate && n.IsRead)
            .ToListAsync();

        _dbSet.RemoveRange(oldNotifications);
    }
}