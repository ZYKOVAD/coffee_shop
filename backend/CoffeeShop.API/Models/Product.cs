using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CoffeeShop.API.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Category")]
        [Column("Category_id")]
        public int CategoryId { get; set; }

        [Required]
        public string Name { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        [Required]
        [Precision(18, 2)]
        public decimal Price { get; set; }

        [Column("Img_url")]
        public string? ImgUrl { get; set; }

        [Column("Is_active")]
        public bool IsActive { get; set; } = true;

        [Column("Count_in_stock")]
        public int Count { get; set; } = 0;
        public virtual Category Category { get; set; } = null!;
        public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
        public virtual ICollection<Modifier> Modifiers { get; set; } = new List<Modifier>();
    }
}
