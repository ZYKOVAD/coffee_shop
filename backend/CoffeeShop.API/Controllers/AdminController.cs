using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "admin")] 
public class AdminController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;

    public AdminController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    // GET: api/admin/users - получить всех пользователей
    [HttpGet("users")]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersWithRolesAsync();
        return Ok(users);
    }

    // GET: api/admin/users/baristas - получить всех бариста
    [HttpGet("users/baristas")]
    public async Task<IActionResult> GetAllBaristas()
    {
        var baristas = await _userService.GetAllBaristasAsync();
        return Ok(baristas);
    }

    // GET: api/admin/users/{id} - получить пользователя по id
    [HttpGet("users/{id}")]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { message = $"User with id {id} not found" });
        return Ok(user);
    }

    // PUT: api/admin/users/{id}/role - изменить роль пользователя
    [HttpPut("users/{id}/role")]
    public async Task<IActionResult> ChangeUserRole(int id, [FromBody] string newRole)
    {
        try
        {
            var user = await _userService.ChangeUserRoleAsync(id, newRole);
            if (user == null)
                return NotFound(new { message = $"User with id {id} not found" });
            return Ok(new { message = $"User role changed to {newRole}", user });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // DELETE: api/admin/users/{id} - удалить пользователя
    [HttpDelete("users/{id}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        // Получаем текущего админа из токена
        var currentUserId = GetCurrentUserId();

        if (currentUserId == id)
            return BadRequest(new { error = "You cannot delete yourself" });

        var result = await _userService.DeleteUserAsync(id);
        if (!result)
            return NotFound(new { message = $"User with id {id} not found" });

        return Ok(new { message = "User deleted successfully" });
    }

    // POST: api/admin/barista - создать бариста 
    [HttpPost("barista")]
    public async Task<IActionResult> CreateBarista([FromBody] RegisterRequestDto request)
    {
        try
        {
            var createDto = new CreateUserDto
            {
                Username = request.Username,
                Phone = request.Phone,
                Email = request.Email,
                Password = request.Password
            };

            var user = await _userService.CreateBaristaAsync(createDto);

            return Ok(new
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Phone = user.Phone,
                Role = Models.User.RoleBarista,
                Message = "Barista created successfully"
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    // Создание администратора 
    [HttpPost("admin")]
    public async Task<IActionResult> CreateAdmin([FromBody] RegisterRequestDto request)
    {
        try
        {
            var createDto = new CreateUserDto
            {
                Username = request.Username,
                Phone = request.Phone,
                Email = request.Email,
                Password = request.Password
            };

            var user = await _userService.CreateAdminAsync(createDto);

            var token = _jwtService.GenerateToken(new User
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = Models.User.RoleAdmin
            });

            return Ok(new AuthResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = Models.User.RoleAdmin,
                BonusBalance = user.BonusBalance,
                Token = token,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim ?? "0");
    }
}