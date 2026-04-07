using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class OrderItemRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<OrderItem> _dbSet;

    public OrderItemRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<OrderItem>();
    }

    public async Task<List<OrderItem>> GetAllAsync()
    {
        return await _dbSet
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .ToListAsync();
    }

    public async Task<OrderItem?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(oi => oi.Order)
            .Include(oi => oi.Product)
            .FirstOrDefaultAsync(oi => oi.Id == id);
    }

    public async Task<List<OrderItem>> GetByOrderIdAsync(int orderId)
    {
        return await _dbSet
            .Where(oi => oi.OrderId == orderId)
            .Include(oi => oi.Product)
            .ToListAsync();
    }

    public async Task AddAsync(OrderItem orderItem)
    {
        await _dbSet.AddAsync(orderItem);
    }

    public async Task AddRangeAsync(IEnumerable<OrderItem> orderItems)
    {
        await _dbSet.AddRangeAsync(orderItems);
    }

    public void Update(OrderItem orderItem)
    {
        _dbSet.Update(orderItem);
    }

    public void Delete(OrderItem orderItem)
    {
        _dbSet.Remove(orderItem);
    }

    public void DeleteRange(IEnumerable<OrderItem> orderItems)
    {
        _dbSet.RemoveRange(orderItems);
    }
}