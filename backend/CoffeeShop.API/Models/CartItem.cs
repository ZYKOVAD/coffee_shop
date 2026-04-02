using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CoffeeShop.API.Models
{
    public class CartItem
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("User")]
        [Column("user_id")]
        public int UserId { get; set; }

        [ForeignKey("Product")]
        [Column("product_id")]
        public int ProductId { get; set; }

        [Required]
        public int Count { get; set; } = 1;

        [Column("selected_modifiers", TypeName = "jsonb")]
        public string SelectedModifiers { get; set; } = "[]";
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
