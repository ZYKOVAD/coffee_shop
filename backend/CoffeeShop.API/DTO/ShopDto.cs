using System.Globalization;

namespace CoffeeShop.API.DTO
{
    public class ShopDto
    {
        public string? Adress { get; set; }
        public TimeOnly Open { get; set; }
        public TimeOnly Close { get; set; }
        public bool IsActive { get; set; }
    }
}
