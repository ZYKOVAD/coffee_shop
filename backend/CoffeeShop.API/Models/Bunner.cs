public class Banner
{
    public int Id { get; set; }
    public string? Title { get; set; }
    public bool IsActive { get; set; } = true;
    public int SortOrder { get; set; }
    public string ImgUrl { get; set; } = null!;
}