using CoffeeShop.API.Data;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CoffeeShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<ActionResult<DashboardStatsDto>> GetStats()
        {
            var stats = new DashboardStatsDto
            {
                UsersCount =
                    await _context.Users.CountAsync(),

                ProductsCount =
                    await _context.Products.CountAsync(),

                CategoriesCount =
                    await _context.Categories.CountAsync(),

                OrdersCount =
                    await _context.Orders.CountAsync(),
            };

            return Ok(stats);
        }
    }
}
