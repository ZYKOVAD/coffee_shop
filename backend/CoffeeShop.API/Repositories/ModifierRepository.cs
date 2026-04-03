using CoffeeShop.API.Data;
using CoffeeShop.API.Models;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Repositories
{
    public class ModifierRepository
    {
        private readonly AppDbContext _context;
        private readonly DbSet<Modifier> _dbSet;

        public ModifierRepository(AppDbContext context)
        {
            _context = context;
            _dbSet = context.Set<Modifier>();
        }

        // Get all modifiers
        public async Task<List<Modifier>> GetAllAsync()
        {
            return await _dbSet
                .Include(m => m.Products)
                .ToListAsync();
        }

        // Get modifier by id
        public async Task<Modifier?> GetByIdAsync(int id)
        {
            return await _dbSet
                .Include(m => m.Products)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        // Get modifiers by product id
        public async Task<List<Modifier>> GetByProductIdAsync(int productId)
        {
            return await _dbSet
                .Where(m => m.Products.Any(p => p.Id == productId))
                .ToListAsync();
        }

        // Add new modifier
        public async Task AddAsync(Modifier modifier)
        {
            await _dbSet.AddAsync(modifier);
        }

        // Update modifier
        public void Update(Modifier modifier)
        {
            _dbSet.Update(modifier);
        }

        // Delete modifier
        public void Delete(Modifier modifier)
        {
            _dbSet.Remove(modifier);
        }

        // Check if modifier exists
        public async Task<bool> ExistsAsync(int id)
        {
            return await _dbSet.AnyAsync(m => m.Id == id);
        }

        // Check if modifier name already exists
        public async Task<bool> NameExistsAsync(string name, int? excludeId = null)
        {
            if (excludeId.HasValue)
            {
                return await _dbSet.AnyAsync(m => m.Name == name && m.Id != excludeId.Value);
            }
            return await _dbSet.AnyAsync(m => m.Name == name);
        }
    }
}
