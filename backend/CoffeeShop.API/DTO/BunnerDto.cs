namespace CoffeeShop.API.DTO
{
    public class CreateBannerFormDto
    {
        public string? Title { get; set; }

        public int SortOrder { get; set; }

        public IFormFile File { get; set; } = null!;
    }

    public class UpdateBannerDto
    {
        public string? Title { get; set; }

        public bool IsActive { get; set; }

        public int SortOrder { get; set; }
    }

    public class UpdateBannerImageDto
    {
        public IFormFile File { get; set; } = null!;
    }
}
