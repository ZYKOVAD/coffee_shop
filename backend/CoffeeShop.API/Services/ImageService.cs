using CoffeeShop.API.Data;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Minio;
using Minio.DataModel.Args;

namespace CoffeeShop.API.Services;

public class ImageService
{
    private readonly AppDbContext _context;
    private readonly MinioService _minioService;

    public ImageService(
        AppDbContext context,
        MinioService minioService)
    {
        _context = context;
        _minioService = minioService;
    }

    public async Task<string> UploadProductImageAsync(
        int productId,
        IFormFile file)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.Id == productId);

        if (product == null)
            throw new Exception("Товар не найден");

        ValidateFile(file);

        // Удаляем старое фото
        if (!string.IsNullOrEmpty(product.ImgUrl))
        {
            await _minioService.DeleteAsync(
                product.ImgUrl
            );
        }

        var extension = Path.GetExtension(file.FileName);

        var safeName = _minioService.GenerateSlug(product.Name);

        var guid = Guid.NewGuid().ToString("N")[..8];

        var fileName = $"{safeName}-{guid}{extension}";

        var imageUrl =
            await _minioService.UploadAsync(
                file,
                "products",
                fileName
            );

        product.ImgUrl = imageUrl;

        await _context.SaveChangesAsync();

        return imageUrl;
    }

    public async Task DeleteProductImageAsync(
        int productId)
    {
        var product = await _context.Products
            .FirstOrDefaultAsync(x => x.Id == productId);

        if (product == null)
            throw new Exception("Товар не найден");

        if (string.IsNullOrEmpty(product.ImgUrl))
            return;

        await _minioService.DeleteAsync(
            product.ImgUrl
        );

        product.ImgUrl = null;

        await _context.SaveChangesAsync();
    }

    public async Task<Banner> CreateBannerAsync(
        string? title,
        int sortOrder,
        IFormFile file)
    {
        ValidateFile(file);

        var slug = _minioService.GenerateSlug(
            string.IsNullOrWhiteSpace(title)
                ? "banner"
                : title
        );

        var extension =
            Path.GetExtension(file.FileName);

        var guid = Guid.NewGuid().ToString("N")[..8];

        var fileName = $"{slug}-{guid}{extension}";

        var imageUrl =
            await _minioService.UploadAsync(
                file,
                "banners",
                fileName
            );

        var banner = new Banner
        {
            Title = title,
            SortOrder = sortOrder,
            ImgUrl = imageUrl,
            IsActive = true
        };

        _context.Banners.Add(banner);

        await _context.SaveChangesAsync();

        return banner;
    }

    public async Task UpdateBannerAsync(
        int bannerId,
        UpdateBannerDto dto)
    {
        var banner = await _context.Banners
            .FirstOrDefaultAsync(x => x.Id == bannerId);

        if (banner == null)
            throw new Exception("Баннер не найден");

        banner.Title = dto.Title;
        banner.IsActive = dto.IsActive;
        banner.SortOrder = dto.SortOrder;

        await _context.SaveChangesAsync();
    }

    public async Task<string> UpdateBannerImageAsync(int bannerId, [FromForm] IFormFile file)
    {
        var banner = await _context.Banners
            .FirstOrDefaultAsync(x => x.Id == bannerId);

        if (banner == null)
            throw new Exception("Баннер не найден");

        ValidateFile(file);

        // удаляем старое фото
        if (!string.IsNullOrEmpty(banner.ImgUrl))
        {
            await _minioService.DeleteAsync(
                banner.ImgUrl
            );
        }

        var slug = _minioService.GenerateSlug(
            string.IsNullOrWhiteSpace(banner.Title)
                ? "banner"
                : banner.Title
        );

        var extension =
            Path.GetExtension(file.FileName);

        var guid = Guid.NewGuid().ToString("N")[..8];

        var fileName = $"{slug}-{guid}{extension}";

        var imageUrl =
            await _minioService.UploadAsync(
                file,
                "banners",
                fileName
            );

        banner.ImgUrl = imageUrl;

        await _context.SaveChangesAsync();

        return imageUrl;
    }

    public async Task DeleteBannerAsync(int bannerId)
    {
        var banner = await _context.Banners
            .FirstOrDefaultAsync(x => x.Id == bannerId);

        if (banner == null)
            throw new Exception("Баннер не найден");

        if (!string.IsNullOrEmpty(banner.ImgUrl))
        {
            await _minioService.DeleteAsync(
                banner.ImgUrl
            );
        }

        _context.Banners.Remove(banner);

        await _context.SaveChangesAsync();
    }


    private void ValidateFile(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new Exception("Файл пуст");

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp" };

        var extension = Path.GetExtension(file.FileName).ToLower();

        if (!allowedExtensions.Contains(extension))
        {
            throw new Exception(
                "Недопустимый формат файла"
            );
        }

        const long maxSize = 5 * 1024 * 1024;

        if (file.Length > maxSize)
        {
            throw new Exception(
                "Файл слишком большой"
            );
        }
    }
}