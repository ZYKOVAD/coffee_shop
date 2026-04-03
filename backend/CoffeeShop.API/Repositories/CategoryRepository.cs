using CoffeeShop.API.Data;
using CoffeeShop.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Repositories
{
    public class CategoryRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Category> _dbSet;

        public CategoryRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<Category>();
        }

        // Get all categories
        public async Task<List<Category>> GetAllAsync()
        {
            return await _dbSet
                .Include(c => c.Products)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        // Get active categories only
        public async Task<List<Category>> GetActiveCategoriesAsync()
        {
            return await _dbSet
                .Where(c => c.IsActive)
                .Include(c => c.Products)
                .OrderBy(c => c.Id)
                .ToListAsync();
        }

        // Get category by id
        public async Task<Category?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Products)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        // Get category with products
        public async Task<Category?> GetCategoryWithProductsAsync(int id)
        {
            return await _dbSet
                .Include(c => c.Products)
                .ThenInclude(p => p.Modifiers)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        // Add new category
        public async Task AddAsync(Category category)
        {
            await _dbSet.AddAsync(category);
        }

        // Update category
        public void Update(Category category)
        {
            _dbSet.Update(category);
        }

        // Delete category
        public void Delete(Category category)
        {
            _dbSet.Remove(category);
        }

        // Check if category exists
        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(c => c.Id == id);
        }

        // Check if category name already exists
        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            if (excludeId.HasValue)
            {
                return await _dbSet.AnyAsync(c => c.Name == name && c.Id != excludeId.Value);
            }
            return await _dbSet.AnyAsync(c => c.Name == name);
        }

        // Get product count in category
        public async Task<int> GetProductCountAsync(int categoryId)
        {
            return await _dbSet
                .Where(c => c.Id == categoryId)
                .SelectMany(c => c.Products)
                .CountAsync();
        }
    }
}
