using CoffeeShop.API.Data;
using CoffeeShop.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Repositories
{
    public class ProductRepository
    {
        protected readonly AppDbContext _context;
        private readonly DbSet<Product> _dbSet;

        public ProductRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<Product>();
        }

        public async Task<List<Product>> GetAllAsync()
        {
            return await _dbSet
                .Include(p => p.Category)
                .Include(p => p.Modifiers)
                .ToListAsync();
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(p => p.Category)
                .Include(p => p.Modifiers)
                .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task<List<Product>> GetActiveProductsAsync()
        {
            return await _dbSet
                .Where(p => p.IsActive)
                .Include(p => p.Category)
                .Include(p => p.Modifiers)
                .ToListAsync();
        }

        public async Task<List<Product>> GetByCategoryAsync(int categoryId)
        {
            return await _dbSet
                .Where(p => p.CategoryId == categoryId && p.IsActive)
                .Include(p => p.Category)
                .Include(p => p.Modifiers)
                .ToListAsync();
        }

        public async Task AddAsync(Product product)
        {
            await _dbSet.AddAsync(product);
        }

        public void Update(Product product)
        {
            _dbSet.Update(product);
        }

        public void Delete(Product product)
        {
            _dbSet.Remove(product);
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(p => p.Id == id);
        }

    }
}
