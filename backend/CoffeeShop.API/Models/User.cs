using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Models
{
    public class User
    {
        public const string RoleUser = "user";
        public const string RoleBarista = "barista";
        public const string RoleAdmin = "admin";

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string? Username { get; set; }

        public string? Phone { get; set; }


        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = string.Empty;
       
        [Required(ErrorMessage = "Password is required")]
        public string PasswordHash { get; set; } = string.Empty;
       
        [Column("Bonus_balance")]
        [Precision(18, 2)]
        public decimal BonusBalance { get; set; }
       
        [Required]
        [Column("Role")]
        public string Role { get; set; } = RoleUser;

        public virtual ICollection<Notification> Notifications { get; set; } = new List<Notification>();
        public virtual ICollection<BonusTransaction> BonusTransactions { get; set; } = new List<BonusTransaction>();
        public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
        public virtual ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }
}
