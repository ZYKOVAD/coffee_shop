using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriesController : ControllerBase
{
    private readonly CategoryService _categoryService;

    public CategoriesController(CategoryService categoryService)
    {
        _categoryService = categoryService;
    }

    // GET: api/categories
    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll()
    {
        var categories = await _categoryService.GetAllCategoriesAsync();
        return Ok(categories);
    }

    // GET: api/categories/active
    [HttpGet("active")]
    [AllowAnonymous]
    public async Task<IActionResult> GetActive()
    {
        var categories = await _categoryService.GetActiveCategoriesAsync();
        return Ok(categories);
    }

    // GET: api/categories/id
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<IActionResult> GetById(int id)
    {
        var category = await _categoryService.GetCategoryByIdAsync(id);
        if (category == null)
            return NotFound(new { message = $"Category with id {id} not found" });

        return Ok(category);
    }

    // GET: api/categories/id/statistics
    [HttpGet("{id}/statistics")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetStatistics(int id)
    {
        var statistics = await _categoryService.GetCategoryStatisticsAsync(id);
        if (statistics == null)
            return NotFound(new { message = $"Category with id {id} not found" });

        return Ok(statistics);
    }

    // POST: api/categories
    [HttpPost]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Create([FromBody] CreateCategoryDto createDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var category = await _categoryService.CreateCategoryAsync(createDto);
            return CreatedAtAction(nameof(GetById), new { id = category.Id }, category);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PUT: api/categories/id
    [HttpPut("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCategoryDto updateDto)
    {
        try
        {
            var category = await _categoryService.UpdateCategoryAsync(id, updateDto);
            if (category == null)
                return NotFound(new { message = $"Category with id {id} not found" });

            return Ok(category);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE: api/categories/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var result = await _categoryService.DeleteCategoryAsync(id);
            if (!result)
                return NotFound(new { message = $"Category with id {id} not found" });

            return NoContent();
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // PUT: api/categories/id/activate
    [HttpPut("{id}/activate")]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> Activate(int id)
    {
        var result = await _categoryService.ActivateCategoryAsync(id);
        if (!result)
            return NotFound(new { message = $"Category with id {id} not found" });

        return Ok(new { message = "Category activated successfully" });
    }

    // PUT: api/categories/id/deactivate 
    [HttpPut("{id}/deactivate")]
    [Authorize(Roles = "admin,barista")]
    public async Task<IActionResult> Deactivate(int id)
    {
        var result = await _categoryService.DeactivateCategoryAsync(id);
        if (!result)
            return NotFound(new { message = $"Category with id {id} not found" });

        return Ok(new { message = "Category deactivated successfully" });
    }
}