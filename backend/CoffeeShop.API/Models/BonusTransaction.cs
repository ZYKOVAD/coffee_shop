using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Models
{
    public class BonusTransaction
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("User")]
        [Column("User_id")]
        public int UserId { get; set; }

        [ForeignKey("Order")]
        [Column("Order_id")]
        public int? OrderId { get; set; }

        [Required]
        [Precision(18, 2)]
        public decimal Amount { get; set; }

        [Required]
        public string Type {  get; set; } = string.Empty;

        [Column("Created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public virtual User User { get; set; } = null!;

        public virtual Order? Order { get; set; }
    }
}
