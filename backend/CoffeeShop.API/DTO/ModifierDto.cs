namespace CoffeeShop.API.DTO
{
    public class ModifierDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public List<int>? ProductIds { get; set; }
    }
    public class CreateModifierDto
    {
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class UpdateModifierDto
    {
        public string? Name { get; set; }
        public decimal? Price { get; set; }
    }

    public class AddModifierToProductDto
    {
        public int ProductId { get; set; }
        public int ModifierId { get; set; }
    }
}
