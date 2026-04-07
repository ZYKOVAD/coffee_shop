using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class BonusTransactionRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<BonusTransaction> _dbSet;

    public BonusTransactionRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<BonusTransaction>();
    }

    public async Task<List<BonusTransaction>> GetAllAsync()
    {
        return await _dbSet
            .Include(bt => bt.User)
            .Include(bt => bt.Order)
            .OrderByDescending(bt => bt.CreatedAt)
            .ToListAsync();
    }

    public async Task<BonusTransaction?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(bt => bt.User)
            .Include(bt => bt.Order)
            .FirstOrDefaultAsync(bt => bt.Id == id);
    }

    public async Task<List<BonusTransaction>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(bt => bt.UserId == userId)
            .OrderByDescending(bt => bt.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<BonusTransaction>> GetByOrderIdAsync(int orderId)
    {
        return await _dbSet
            .Where(bt => bt.OrderId == orderId)
            .ToListAsync();
    }

    public async Task<decimal> GetTotalAccruedAsync(int userId)
    {
        return await _dbSet
            .Where(bt => bt.UserId == userId && bt.Type == "accrual")
            .SumAsync(bt => bt.Amount);
    }

    public async Task<decimal> GetTotalRedeemedAsync(int userId)
    {
        return await _dbSet
            .Where(bt => bt.UserId == userId && bt.Type == "redemption")
            .SumAsync(bt => bt.Amount);
    }

    public async Task AddAsync(BonusTransaction transaction)
    {
        await _dbSet.AddAsync(transaction);
    }

    public void Delete(BonusTransaction transaction)
    {
        _dbSet.Remove(transaction);
    }
}