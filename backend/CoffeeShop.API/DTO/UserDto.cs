using System.ComponentModel.DataAnnotations;
using System.Globalization;

namespace CoffeeShop.API.DTO
{
    public class UserDto
    {
        public int Id { get; set; }
        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string Email { get; set; } = string.Empty;
        public decimal BonusBalance { get; set; }
        public string Role { get; set; } = string.Empty;
    }

    public class CreateUserDto
    {
        public string? Username { get; set; }
        public string? Phone { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "Password is required")]
        public string Password { get; set; } = string.Empty;
    }

    public class LoginUserDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    public class UpdateUserDto
    {
        public string? Username { get; set; }
        public string? Phone { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
    }
}