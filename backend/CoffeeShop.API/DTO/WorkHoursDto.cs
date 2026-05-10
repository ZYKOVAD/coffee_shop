namespace CoffeeShop.API.DTO
{
    public class WorkingHoursDto
    {
        public TimeSpan OpenTime { get; set; }
        public TimeSpan CloseTime { get; set; }
        public bool IsClosed { get; set; }
    }
}
