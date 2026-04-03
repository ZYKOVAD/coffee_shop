using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class CategoryService
{
    private readonly CategoryRepository _categoryRepository;
    private readonly AppDbContext _context;

    public CategoryService(CategoryRepository categoryRepository, AppDbContext context)
    {
        _categoryRepository = categoryRepository;
        _context = context;
    }

    // Get all categories
    public async Task<List<CategoryDto>> GetAllCategoriesAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return categories.Select(c => MapToDto(c)).ToList();
    }

    // Get active categories only
    public async Task<List<CategoryDto>> GetActiveCategoriesAsync()
    {
        var categories = await _categoryRepository.GetActiveCategoriesAsync();
        return categories.Select(c => MapToDto(c)).ToList();
    }

    // Get category by id
    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await _categoryRepository.GetCategoryWithProductsAsync(id);
        return category == null ? null : MapToDto(category);
    }

    // Create new category
    public async Task<CategoryDto> CreateCategoryAsync(CreateCategoryDto createDto)
    {
        if (await _categoryRepository.NameExistsAsync(createDto.Name))
        {
            throw new Exception($"Category with name '{createDto.Name}' already exists");
        }

        var category = new Category
        {
            Name = createDto.Name,
            IsActive = createDto.IsActive
        };

        await _categoryRepository.AddAsync(category);
        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    // Update category
    public async Task<CategoryDto?> UpdateCategoryAsync(int id, UpdateCategoryDto updateDto)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
        {
            return null;
        }

        if (!string.IsNullOrEmpty(updateDto.Name))
        {
            if (await _categoryRepository.NameExistsAsync(updateDto.Name, id))
            {
                throw new Exception($"Category with name '{updateDto.Name}' already exists");
            }
            category.Name = updateDto.Name;
        }

        if (updateDto.IsActive.HasValue)
        {
            category.IsActive = updateDto.IsActive.Value;
        }

        _categoryRepository.Update(category);
        await _context.SaveChangesAsync();

        return MapToDto(category);
    }

    // Delete category (only if no products)
    public async Task<bool> DeleteCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        // Check if category has products
        var productCount = await _categoryRepository.GetProductCountAsync(id);
        if (productCount > 0)
        {
            throw new Exception($"Cannot delete category with {productCount} products. Move or delete products first.");
        }

        _categoryRepository.Delete(category);
        await _context.SaveChangesAsync();

        return true;
    }

    // Activate category
    public async Task<bool> ActivateCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        category.IsActive = true;
        _categoryRepository.Update(category);
        await _context.SaveChangesAsync();

        return true;
    }

    // Deactivate category
    public async Task<bool> DeactivateCategoryAsync(int id)
    {
        var category = await _categoryRepository.GetByIdAsync(id);
        if (category == null)
        {
            return false;
        }

        category.IsActive = false;
        _categoryRepository.Update(category);
        await _context.SaveChangesAsync();

        return true;
    }

    // Get category statistics
    public async Task<CategoryStatisticsDto> GetCategoryStatisticsAsync(int id)
    {
        var category = await _categoryRepository.GetCategoryWithProductsAsync(id);
        if (category == null)
            return null;

        var totalProducts = category.Products.Count;
        var activeProducts = category.Products.Count(p => p.IsActive);
        var totalValue = category.Products.Sum(p => p.Price);

        return new CategoryStatisticsDto
        {
            CategoryId = category.Id,
            CategoryName = category.Name,
            TotalProducts = totalProducts,
            ActiveProducts = activeProducts,
            TotalInventoryValue = totalValue,
            AverageProductPrice = totalProducts > 0 ? totalValue / totalProducts : 0
        };
    }

    // Map Category to CategoryDto
    private CategoryDto MapToDto(Category category)
    {
        return new CategoryDto
        {
            Id = category.Id,
            Name = category.Name,
            IsActive = category.IsActive,
            ProductCount = category.Products?.Count ?? 0,
            Products = category.Products?.Select(p => new ProductSimpleDto
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price
            }).ToList()
        };
    }
}