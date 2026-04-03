using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class ModifierService
{
    private readonly ModifierRepository _modifierRepository;
    private readonly ProductRepository _productRepository;
    private readonly AppDbContext _context;

    public ModifierService(
        ModifierRepository modifierRepository,
        ProductRepository productRepository,
        AppDbContext context)
    {
        _modifierRepository = modifierRepository;
        _productRepository = productRepository;
        _context = context;
    }

    // Get all modifiers
    public async Task<List<ModifierDto>> GetAllModifiersAsync()
    {
        var modifiers = await _modifierRepository.GetAllAsync();
        return modifiers.Select(m => MapToDto(m)).ToList();
    }

    // Get modifier by id
    public async Task<ModifierDto?> GetModifierByIdAsync(int id)
    {
        var modifier = await _modifierRepository.GetByIdAsync(id);
        return modifier == null ? null : MapToDto(modifier);
    }

    // Get modifiers by product
    public async Task<List<ModifierDto>> GetModifiersByProductAsync(int productId)
    {
        var modifiers = await _modifierRepository.GetByProductIdAsync(productId);
        return modifiers.Select(m => MapToDto(m)).ToList();
    }

    // Create new modifier
    public async Task<ModifierDto> CreateModifierAsync(CreateModifierDto createDto)
    {
        // Check if name already exists
        if (await _modifierRepository.NameExistsAsync(createDto.Name))
        {
            throw new Exception($"Modifier with name '{createDto.Name}' already exists");
        }

        var modifier = new Modifier
        {
            Name = createDto.Name,
            Price = createDto.Price
        };

        await _modifierRepository.AddAsync(modifier);
        await _context.SaveChangesAsync();

        return MapToDto(modifier);
    }

    // Update modifier
    public async Task<ModifierDto?> UpdateModifierAsync(int id, UpdateModifierDto updateDto)
    {
        var modifier = await _modifierRepository.GetByIdAsync(id);
        if (modifier == null)
        {
            return null;
        }

        // Update name if provided and not duplicate
        if (!string.IsNullOrEmpty(updateDto.Name))
        {
            if (await _modifierRepository.NameExistsAsync(updateDto.Name, id))
            {
                throw new Exception($"Modifier with name '{updateDto.Name}' already exists");
            }
            modifier.Name = updateDto.Name;
        }

        if (updateDto.Price.HasValue)
        {
            modifier.Price = updateDto.Price.Value;
        }

        _modifierRepository.Update(modifier);
        await _context.SaveChangesAsync();

        return MapToDto(modifier);
    }

    // Delete modifier
    public async Task<bool> DeleteModifierAsync(int id)
    {
        var modifier = await _modifierRepository.GetByIdAsync(id);
        if (modifier == null)
        {
            return false;
        }

        //// Check if modifier is used in any cart items or order items
        //var isUsedInCart = await _context.CartItems
        //    .AnyAsync(ci => ci.SelectedModifiers.Contains($"\"modifierId\":{id}"));

        //var isUsedInOrder = await _context.OrderItems
        //    .AnyAsync(oi => oi.SelectedModifiers.Contains($"\"modifierId\":{id}"));

        //if (isUsedInCart || isUsedInOrder)
        //{
        //    throw new Exception("Cannot delete modifier that is used in cart or orders");
        //}

        _modifierRepository.Delete(modifier);
        await _context.SaveChangesAsync();

        return true;
    }

    // Add modifier to product
    public async Task<bool> AddModifierToProductAsync(int modifierId, int productId)
    {
        var modifier = await _modifierRepository.GetByIdAsync(modifierId);
        if (modifier == null) return false;

        var product = await _productRepository.GetByIdAsync(productId);
        if (product == null) return false;

        if (modifier.Products == null)
            modifier.Products = new List<Product>();

        if (!modifier.Products.Any(p => p.Id == productId))
        {
            modifier.Products.Add(product);
            await _context.SaveChangesAsync();
        }

        return true;
    }

    // Remove modifier from product
    public async Task<bool> RemoveModifierFromProductAsync(int modifierId, int productId)
    {
        var modifier = await _modifierRepository.GetByIdAsync(modifierId);
        if (modifier == null) return false;

        if (modifier.Products != null)
        {
            var product = modifier.Products.FirstOrDefault(p => p.Id == productId);
            if (product != null)
            {
                modifier.Products.Remove(product);
                await _context.SaveChangesAsync();
            }
        }

        return true;
    }

    // Map Modifier to ModifierDto
    private ModifierDto MapToDto(Modifier modifier)
    {
        return new ModifierDto
        {
            Id = modifier.Id,
            Name = modifier.Name,
            Price = modifier.Price,
            ProductIds = modifier.Products?.Select(p => p.Id).ToList()
        };
    }
}
