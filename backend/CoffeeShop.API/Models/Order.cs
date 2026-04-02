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
        [Column("user_id")]
        public int UserId { get; set; }
        [Required]
        public string Status { get; set; } = string.Empty;
        [Column("total_price")]
        [Precision(18, 2)]
        public decimal TotalPrice { get; set; }
        [Column("bonus_used")]
        [Precision(18, 2)]
        public decimal BonusUsed { get; set; }
        [Column("bonus_earned")]
        [Precision(18, 2)]
        public decimal BonusEarned { get; set; }
        [Column("pickup_time")]
        public DateTime PickupTime { get; set; }
        [Column("barista_comment")]
        public string BaristaComment { get; set; } = string.Empty;
        [Column("client_comment")]
        public string ClientComment { get; set; } = string.Empty;
        [Column("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public virtual User User { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<BonusTransaction> BonusTransactions { get; set; } = new List<BonusTransaction>();
    }
}
