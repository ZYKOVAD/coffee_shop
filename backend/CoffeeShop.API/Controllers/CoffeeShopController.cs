using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Data;
using CoffeeShop.API.DTO;

namespace CoffeeShop.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CoffeeShopController : ControllerBase
    {
        private readonly DbSet<Shop> _dbSet;
        private readonly AppDbContext _context;

        public CoffeeShopController(AppDbContext context)
        {
            _dbSet = context.Set<Shop>();
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Shop>> GetAll()
        {
            var result = await _dbSet.ToListAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Shop>> GetById(int id)
        {
            var result = await _dbSet.FirstOrDefaultAsync(s => s.Id == id);

            if (result == null)
                return NotFound($"Магазин с id {id} не найден");

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<Shop>> Create(ShopDto request)
        {
            var shop = new Shop
            {
                Adress = request.Adress,
                Open = request.Open,
                Close = request.Close,
                IsActive = request.IsActive
            };

            await _dbSet.AddAsync(shop);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById), new { id = shop.Id }, shop);
        }

        [HttpPut]
        public async Task<IActionResult> Update(ShopDto request)
        {
            var shop = await _dbSet.FirstOrDefaultAsync(s => s.Id == 1);

            if (shop == null)
                return NotFound("Магазин не найден");

            shop.Adress = request.Adress;
            shop.Close = request.Close;
            shop.Open = request.Open;
            shop.IsActive = request.IsActive;

            _dbSet.Update(shop);
            await _context.SaveChangesAsync();

            return Ok(shop);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var shop = await _dbSet.FirstOrDefaultAsync(s => s.Id == id);

            if (shop == null)
                return NotFound($"Магазин с id {id} не найден");

            _dbSet.Remove(shop);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
