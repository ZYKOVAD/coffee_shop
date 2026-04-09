using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class UserRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<User> _dbSet;

    public UserRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<User>();
    }

    public async Task<List<User>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(u => u.Orders)
            .Include(u => u.Notifications)
            .Include(u => u.BonusTransactions)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<User?> GetByEmailAsync(string email)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task<User?> GetByPhoneAsync(string phone)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Phone == phone);
    }

    public async Task<User?> GetByUsernameAsync(string username)
    {
        return await _dbSet.FirstOrDefaultAsync(u => u.Username == username);
    }

    public async Task<List<User>> GetByRoleAsync(string role)
    {
        return await _dbSet
            .Where(u => u.Role == role)
            .ToListAsync();
    }

    public async Task AddAsync(User user)
    {
        await _dbSet.AddAsync(user);
    }

    public void Update(User user)
    {
        _dbSet.Update(user);
    }

    public void Delete(User user)
    {
        _dbSet.Remove(user);
    }

    public async Task<bool> ExistsAsync(int id)
    {
        return await _dbSet.AnyAsync(u => u.Id == id);
    }

    public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
    {
        if (excludeId.HasValue)
            return await _dbSet.AnyAsync(u => u.Email == email && u.Id != excludeId.Value);
        return await _dbSet.AnyAsync(u => u.Email == email);
    }

    public async Task<bool> PhoneExistsAsync(string phone, int? excludeId = null)
    {
        if (excludeId.HasValue)
            return await _dbSet.AnyAsync(u => u.Phone == phone && u.Id != excludeId.Value);
        return await _dbSet.AnyAsync(u => u.Phone == phone);
    }

    public async Task<decimal> GetBonusBalanceAsync(int userId)
    {
        var user = await _dbSet.FindAsync(userId);
        return user?.BonusBalance ?? 0;
    }
}