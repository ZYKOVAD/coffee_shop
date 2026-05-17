using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CoffeeShop.API.Models
{
    public class Shop
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        public string Adress { get; set; } = string.Empty;

        [Required]
        public TimeOnly Open { get; set; }

        [Required]
        public TimeOnly Close { get; set; }

        [Required]
        public bool IsActive { get; set; } = false;
    }
}
