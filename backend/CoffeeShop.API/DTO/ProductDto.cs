namespace CoffeeShop.API.DTO
{
    public class ProductDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public bool IsActive { get; set; }
        public bool IsPopular { get; set; }
        public string? ImgUrl { get; set; }
        public List<ModifierDto> Modifiers { get; set; } = new();
    }

    public class CreateProductDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public decimal Price { get; set; }
        public int CategoryId { get; set; }
    }

    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public bool? IsActive { get; set; }
        public bool? IsPopular { get; set; }
        public string? ImgUrl { get; set; }
    }

    public class UpdateProductImageDto
    {
        public IFormFile File { get; set; } = null!;
    }
}
