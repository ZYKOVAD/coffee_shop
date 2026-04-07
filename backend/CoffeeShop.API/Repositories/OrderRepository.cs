using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class OrderRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<Order> _dbSet;

    public OrderRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<Order>();
    }

    public async Task<List<Order>> GetAllAsync()
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<Order?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    public async Task<List<Order>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Order>> GetByStatusAsync(string status)
    {
        return await _dbSet
            .Where(o => o.Status == status)
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderBy(o => o.PickupTime)
            .ThenBy(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Order>> GetPendingOrdersForBaristaAsync()
    {
        return await _dbSet
            .Where(o => o.Status == "pending" || o.Status == "confirmed")
            .Include(o => o.User)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .OrderBy(o => o.PickupTime)
            .ThenBy(o => o.CreatedAt)
            .ToListAsync();
    }

    public async Task AddAsync(Order order)
    {
        await _dbSet.AddAsync(order);
    }

    public void Update(Order order)
    {
        _dbSet.Update(order);
    }

    public void Delete(Order order)
    {
        _dbSet.Remove(order);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.AnyAsync(o => o.Id == id);
    }

    public async Task<int> GetUserOrderCountAsync(int userId)
    {
        return await _dbSet.CountAsync(o => o.UserId == userId);
    }
}