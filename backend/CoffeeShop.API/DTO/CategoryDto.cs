namespace CoffeeShop.API.DTO
{
    public class CategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public int ProductCount { get; set; }
        public List<ProductSimpleDto>? Products { get; set; }
    }

    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; } = true;
    }

    public class UpdateCategoryDto
    {
        public string? Name { get; set; }
        public bool? IsActive { get; set; }
    }

    public class ProductSimpleDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }
    public class CategoryStatisticsDto
    {
        public int CategoryId { get; set; }
        public string CategoryName { get; set; } = string.Empty;
        public int TotalProducts { get; set; }
        public int ActiveProducts { get; set; }
        public decimal TotalInventoryValue { get; set; }
        public decimal AverageProductPrice { get; set; }
    }
}
