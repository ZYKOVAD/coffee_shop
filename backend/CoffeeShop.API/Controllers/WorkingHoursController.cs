using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Data;
using CoffeeShop.API.DTO;

namespace CoffeeShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WorkingHoursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public WorkingHoursController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<WorkingHours>>> Get()
        {
            var result = await _context.WorkingHours
                .ToListAsync();

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> Update(List<WorkingHoursDto> request)
        {
            var existing = await _context.WorkingHours.ToListAsync();

            _context.WorkingHours.RemoveRange(existing);

            var newEntities = request.Select(x => new WorkingHours
            {
                OpenTime = x.OpenTime,
                CloseTime = x.CloseTime,
                IsClosed = x.IsClosed
            });

            await _context.WorkingHours.AddRangeAsync(newEntities);

            await _context.SaveChangesAsync();

            return Ok();
        }
    }
}
