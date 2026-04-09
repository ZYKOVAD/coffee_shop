using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Models
{
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [ForeignKey("User")]
        [Column("User_id")]
        public int UserId { get; set; }
        [Required]
        public string Status { get; set; } = string.Empty;
        [Column("Total_price")]
        [Precision(18, 2)]
        public decimal TotalPrice { get; set; }
        [Column("Bonus_used")]
        [Precision(18, 2)]
        public decimal BonusUsed { get; set; }
        [Column("Bonus_earned")]
        [Precision(18, 2)]
        public decimal BonusEarned { get; set; }
        [Column("Pickup_time")]
        public DateTime PickupTime { get; set; }
        [Column("Barista_comment")]
        public string BaristaComment { get; set; } = string.Empty;
        [Column("Client_comment")]
        public string ClientComment { get; set; } = string.Empty;
        [Column("Created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<BonusTransaction> BonusTransactions { get; set; } = new List<BonusTransaction>();
    }
}
