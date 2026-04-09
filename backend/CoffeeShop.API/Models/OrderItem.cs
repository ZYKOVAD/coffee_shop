using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CoffeeShop.API.Models
{
    public class OrderItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Order")]
        [Column("Order_id")]
        public int OrderId { get; set; }

        [ForeignKey("Product")]
        [Column("Product_id")]
        public int ProductId { get; set; }

        [Required]
        [Column("Product_name")]
        [MaxLength(200)]
        public string ProductName { get; set; } = string.Empty;

        [Column("Count_items")]
        public int Count { get; set; }

        [Required]
        [Precision(18, 2)]
        public decimal Price { get; set; }

        [Column("Selected_modifiers", TypeName = "jsonb")]
        public string SelectedModifiers { get; set; } = "[]";

        [Column("Total_price")]
        [Precision(18, 2)]
        public decimal TotalPrice { get; set; }

        public virtual Order Order { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;

    }
}
