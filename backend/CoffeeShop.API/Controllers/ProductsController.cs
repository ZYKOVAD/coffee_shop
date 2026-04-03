using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Data;
using CoffeeShop.API.Models;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Services;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly ProductService _productService;

    public ProductsController(ProductService productService)
    {
        _productService = productService;
    }

    // GET: api/products
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var products = await _productService.GetAllProductsAsync();
        return Ok(products);
    }

    // GET: api/products/active
    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var products = await _productService.GetActiveProductsAsync();
        return Ok(products);
    }

    // GET: api/products/category/id
    [HttpGet("category/{categoryId}")]
    public async Task<IActionResult> GetByCategory(int categoryId)
    {
        var products = await _productService.GetProductsByCategoryAsync(categoryId);
        return Ok(products);
    }

    // GET: api/products/id
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product = await _productService.GetProductByIdAsync(id);
        if (product == null)
            return NotFound(new { message = $"Product with id {id} not found" });

        return Ok(product);
    }

    // POST: api/products
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateProductDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var product = await _productService.CreateProductAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PUT: api/products/id
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDto updateDto)
    {
        var product = await _productService.UpdateProductAsync(id, updateDto);
        if (product == null)
            return NotFound(new { message = $"Product with id {id} not found" });

        return Ok(product);
    }

    // PUT: api/products/activate/id
    [HttpPut("activate/{id}")]
    public async Task<IActionResult> Activate(int id)
    {
        var result = await _productService.ActivateProductAsync(id);
        if (!result)
            return NotFound(new { message = $"Product with id {id} not found" });

        return NoContent();
    }

    // PUT: api/products/deactivate/id
    [HttpPut("deactivate/{id}")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var result = await _productService.DeactivateProductAsync(id);
        if (!result)
            return NotFound(new { message = $"Product with id {id} not found" });

        return NoContent();
    }

    // DELETE: api/products/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _productService.DeleteProductAsync(id);
        if (!result)
            return NotFound(new { message = $"Product with id {id} not found" });

        return NoContent();
    }

    // POST: api/products/id/modifiers/id
    [HttpPost("{productId}/modifiers/{modifierId}")]
    public async Task<IActionResult> AddModifier(int productId, int modifierId)
    {
        var result = await _productService.AddModifierToProductAsync(productId, modifierId);
        if (!result)
            return BadRequest(new { message = "Failed to add modifier" });

        return Ok(new { message = "Modifier added successfully" });
    }

    // DELETE: api/products/id/modifiers/id
    [HttpDelete("{productId}/modifiers/{modifierId}")]
    public async Task<IActionResult> RemoveModifier(int productId, int modifierId)
    {
        var result = await _productService.RemoveModifierFromProductAsync(productId, modifierId);
        if (!result)
            return BadRequest(new { message = "Failed to remove modifier" });

        return Ok(new { message = "Modifier removed successfully" });
    }

}