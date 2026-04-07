using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Repositories;

public class CartItemRepository
{
    private readonly AppDbContext _context;
    private readonly DbSet<CartItem> _dbSet;

    public CartItemRepository(AppDbContext context)
    {
        _context = context;
        _dbSet = context.Set<CartItem>();
    }

    public async Task<List<CartItem>> GetAllAsync()
    {
        return await _dbSet
            .Include(ci => ci.User)
            .Include(ci => ci.Product)
            .ToListAsync();
    }

    public async Task<CartItem?> GetByIdAsync(int id)
    {
        return await _dbSet
            .Include(ci => ci.Product)
            .FirstOrDefaultAsync(ci => ci.Id == id);
    }

    public async Task<List<CartItem>> GetByUserIdAsync(int userId)
    {
        return await _dbSet
            .Where(ci => ci.UserId == userId)
            .Include(ci => ci.Product)
            .ToListAsync();
    }

    public async Task<CartItem?> GetByUserAndProductAsync(int userId, int productId, string selectedModifiers)
    {
        return await _dbSet
            .FirstOrDefaultAsync(ci => ci.UserId == userId &&
                                       ci.ProductId == productId &&
                                       ci.SelectedModifiers == selectedModifiers);
    }

    public async Task AddAsync(CartItem cartItem)
    {
        await _dbSet.AddAsync(cartItem);
    }

    public void Update(CartItem cartItem)
    {
        _dbSet.Update(cartItem);
    }

    public void Delete(CartItem cartItem)
    {
        _dbSet.Remove(cartItem);
    }

    public async Task ClearUserCartAsync(int userId)
    {
        var cartItems = await _dbSet.Where(ci => ci.UserId == userId).ToListAsync();
        _dbSet.RemoveRange(cartItems);
    }

    public async Task<int> GetCartCountAsync(int userId)
    {
        return await _dbSet.Where(ci => ci.UserId == userId).SumAsync(ci => ci.Count);
    }

    public async Task<decimal> GetCartTotalAsync(int userId)
    {
        var cartItems = await GetByUserIdAsync(userId);
        return cartItems.Sum(ci => ci.Product.Price * ci.Count);
    }
}