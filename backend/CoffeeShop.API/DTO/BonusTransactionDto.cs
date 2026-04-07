namespace CoffeeShop.API.DTO
{
    public class BonusTransactionDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int? OrderId { get; set; }
        public decimal Amount { get; set; }
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class BonusTransactionSummaryDto
    {
        public decimal TotalAccrued { get; set; }
        public decimal TotalRedeemed { get; set; }
        public decimal CurrentBalance { get; set; }
    }
}
