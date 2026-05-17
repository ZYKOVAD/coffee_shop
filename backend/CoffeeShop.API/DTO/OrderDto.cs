namespace CoffeeShop.API.DTO
{
    public class OrderDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public decimal TotalPrice { get; set; }
        public decimal BonusUsed { get; set; }
        public decimal BonusEarned { get; set; }
        public DateTime? PickupTime { get; set; }
        public string? BaristaComment { get; set; }
        public string? ClientComment { get; set; }
        public DateTime CreatedAt { get; set; }
        public int OrderNumber { get; set; }
        public List<OrderItemDto> Items { get; set; } = new();
    }

    public class CreateOrderDto
    {
        public DateTime PickupTime { get; set; }
        public string? ClientComment { get; set; }
        public decimal BonusToUse { get; set; } = 0;
    }

    public class UpdateOrderStatusDto
    {
        public int OrderId { get; set; }
        public string Status { get; set; } = string.Empty;
        public string? BaristaComment { get; set; }
    }
}
