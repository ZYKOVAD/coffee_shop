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
        [Column("User_id")]
        public int UserId { get; set; }

        [ForeignKey("Product")]
        [Column("Product_id")]
        public int ProductId { get; set; }

        [Required]
        public int Count { get; set; } = 1;

        [Column("Selected_modifiers", TypeName = "jsonb")]
        public string SelectedModifiers { get; set; } = "[]";
        public virtual User User { get; set; } = null!;
        public virtual Product Product { get; set; } = null!;
    }
}
