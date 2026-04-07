namespace CoffeeShop.API.DTO
{
    public class OrderItemDto
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Count { get; set; }
        public decimal Price { get; set; }
        public decimal TotalPrice { get; set; }
        public string SelectedModifiers { get; set; } = "[]";
    }

    public class CartItemDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public decimal ProductPrice { get; set; }
        public int Count { get; set; }
        public string SelectedModifiers { get; set; } = "[]";
        public decimal TotalPrice { get; set; }
    }

    public class AddToCartDto
    {
        public int ProductId { get; set; }
        public int Count { get; set; } = 1;
        public string SelectedModifiers { get; set; } = "[]";
    }

    public class UpdateCartItemDto
    {
        public int Count { get; set; }
        public string? SelectedModifiers { get; set; }
    }
}
