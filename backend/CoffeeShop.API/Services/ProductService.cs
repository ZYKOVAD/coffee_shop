using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class ProductService
{
    private readonly ProductRepository _productRepository;
    private readonly AppDbContext _context; 

    public ProductService(ProductRepository productRepository, AppDbContext context)
    {
        _productRepository = productRepository;
        _context = context;
    }

    // Get all products
    public async Task<List<ProductDto>> GetAllProductsAsync()
    {
        var products = await _productRepository.GetAllAsync();
        return products.Select(p => MapToDto(p)).ToList();
    }

    // Get product by id
    public async Task<ProductDto?> GetProductByIdAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        return product == null ? null : MapToDto(product);
    }

    // Get active products
    public async Task<List<ProductDto>> GetActiveProductsAsync()
    {
        var products = await _productRepository.GetActiveProductsAsync();
        return products.Select(p => MapToDto(p)).ToList();
    }

    // Get products by category
    public async Task<List<ProductDto>> GetProductsByCategoryAsync(int categoryId)
    {
        var products = await _productRepository.GetByCategoryAsync(categoryId);
        return products.Select(p => MapToDto(p)).ToList();
    }

    // Create new product
    public async Task<ProductDto> CreateProductAsync(CreateProductDto createDto)
    {
        var categoryExists = await _context.Categories.AnyAsync(c => c.Id == createDto.CategoryId);
        if (!categoryExists)
        {
            throw new Exception($"Category with id {createDto.CategoryId} not found");
        }

        var product = new Product
        {
            Name = createDto.Name,
            Description = createDto.Description ?? "",
            Price = createDto.Price,
            CategoryId = createDto.CategoryId,
            ImgUrl = createDto.ImgUrl,
            IsActive = true,
            Count = 0
        };

        await _productRepository.AddAsync(product);
        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    // Update product
    public async Task<ProductDto?> UpdateProductAsync(int id, UpdateProductDto updateDto)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            return null;
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(updateDto.Name))
            product.Name = updateDto.Name;

        if (!string.IsNullOrEmpty(updateDto.Description))
            product.Description = updateDto.Description;

        if (updateDto.Price.HasValue)
            product.Price = updateDto.Price.Value;

        if (updateDto.IsActive.HasValue)
            product.IsActive = updateDto.IsActive.Value;

        if (!string.IsNullOrEmpty(updateDto.ImgUrl))
            product.ImgUrl = updateDto.ImgUrl;

        _productRepository.Update(product);
        await _context.SaveChangesAsync();

        return MapToDto(product);
    }

    // Activate product
    public async Task<bool> ActivateProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        product.IsActive = true;
        _productRepository.Update(product);
        await _context.SaveChangesAsync();

        return true;
    }

    // Deactivate product
    public async Task<bool> DeactivateProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        product.IsActive = false;
        _productRepository.Update(product);
        await _context.SaveChangesAsync();

        return true;
    }

    // Delete product
    public async Task<bool> DeleteProductAsync(int id)
    {
        var product = await _productRepository.GetByIdAsync(id);
        if (product == null)
        {
            return false;
        }

        _productRepository.Delete(product);
        await _context.SaveChangesAsync();

        return true;
    }

    // Add modifier to product
    public async Task<bool> AddModifierToProductAsync(int productId, int modifierId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return false;

        var modifier = await _context.Modifiers.FindAsync(modifierId);
        if (modifier == null) return false;

        if (product.Modifiers == null)
            product.Modifiers = new List<Modifier>();

        if (!product.Modifiers.Any(m => m.Id == modifierId))
        {
            product.Modifiers.Add(modifier);
            await _context.SaveChangesAsync();
        }

        return true;
    }

    // Remove modifier from product
    public async Task<bool> RemoveModifierFromProductAsync(int productId, int modifierId)
    {
        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return false;

        if (product.Modifiers != null)
        {
            var modifier = product.Modifiers.FirstOrDefault(m => m.Id == modifierId);
            if (modifier != null)
            {
                product.Modifiers.Remove(modifier);
                await _context.SaveChangesAsync();
            }
        }

        return true;
    }

    // Map Product to ProductDto
    private ProductDto MapToDto(Product product)
    {
        return new ProductDto
        {
            Id = product.Id,
            Name = product.Name,
            Description = product.Description,
            Price = product.Price,
            CategoryId = product.CategoryId,
            CategoryName = product.Category?.Name,
            IsActive = product.IsActive,
            ImgUrl = product.ImgUrl,
            Modifiers = product.Modifiers?.Select(m => new ModifierDto
            {
                Id = m.Id,
                Name = m.Name,
                Price = m.Price
            }).ToList() ?? new List<ModifierDto>()
        };
    }
}