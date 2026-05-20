using CoffeeShop.API.Data;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BannersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ImageService _bannerService;

    public BannersController(
        AppDbContext context,
        ImageService bannerService)
    {
        _context = context;
        _bannerService = bannerService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var banners = await _context.Banners
            .OrderBy(x => x.SortOrder)
            .ToListAsync();

        return Ok(banners);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateBannerFormDto dto)
    {
        var banner = await _bannerService.CreateBannerAsync(dto.Title, dto.SortOrder, dto.File);

        return Ok(banner);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, UpdateBannerDto dto)
    {
        await _bannerService.UpdateBannerAsync(id, dto);
        return NoContent();
    }

    [HttpPost("{id}/image")]
    public async Task<IActionResult> UpdateImage(int id, [FromForm] UpdateBannerImageDto dto)
    {
        var imageUrl = await _bannerService.UpdateBannerImageAsync(id, dto.File);

        return Ok(new
        {
            imageUrl
        });
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _bannerService.DeleteBannerAsync(id);

        return NoContent();
    }
}