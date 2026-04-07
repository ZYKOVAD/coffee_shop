using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModifiersController : ControllerBase
{
    private readonly ModifierService _modifierService;

    public ModifiersController(ModifierService modifierService)
    {
        _modifierService = modifierService;
    }

    // GET: api/modifiers
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var modifiers = await _modifierService.GetAllModifiersAsync();
        return Ok(modifiers);
    }

    // GET: api/modifiers/id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var modifier = await _modifierService.GetModifierByIdAsync(id);
        if (modifier == null)
            return NotFound(new { message = $"Modifier with id {id} not found" });

        return Ok(modifier);
    }

    // GET: api/modifiers/product/id
    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProduct(int productId)
    {
        var modifiers = await _modifierService.GetModifiersByProductAsync(productId);
        return Ok(modifiers);
    }

    // POST: api/modifiers
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateModifierDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var modifier = await _modifierService.CreateModifierAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = modifier.Id }, modifier);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PUT: api/modifiers/id
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateModifierDto updateDto)
    {
        try
        {
            var modifier = await _modifierService.UpdateModifierAsync(id, updateDto);
            if (modifier == null)
                return NotFound(new { message = $"Modifier with id {id} not found" });

            return Ok(modifier);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE: api/modifiers/id
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _modifierService.DeleteModifierAsync(id);
            if (!result)
                return NotFound(new { message = $"Modifier with id {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // POST: api/modifiers/id/products/id
    [HttpPost("{modifierId}/products/{productId}")]
    public async Task<IActionResult> AddToProduct(int modifierId, int productId)
    {
        var result = await _modifierService.AddModifierToProductAsync(modifierId, productId);
        if (!result)
            return BadRequest(new { message = "Failed to add modifier to product" });

        return Ok(new { message = "Modifier added to product successfully" });
    }

    // DELETE: api/modifiers/id/products/id
    [HttpDelete("{modifierId}/products/{productId}")]
    public async Task<IActionResult> RemoveFromProduct(int modifierId, int productId)
    {
        var result = await _modifierService.RemoveModifierFromProductAsync(modifierId, productId);
        if (!result)
            return BadRequest(new { message = "Failed to remove modifier from product" });

        return Ok(new { message = "Modifier removed from product successfully" });
    }
}