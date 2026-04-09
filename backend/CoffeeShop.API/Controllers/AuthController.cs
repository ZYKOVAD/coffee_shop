using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;
using CoffeeShop.API.Models;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserService _userService;
    private readonly JwtService _jwtService;

    public AuthController(UserService userService, JwtService jwtService)
    {
        _userService = userService;
        _jwtService = jwtService;
    }

    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDto request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var createDto = new CreateUserDto
            {
                Username = request.Username,
                Phone = request.Phone,
                Email = request.Email,
                Password = request.Password
            };

            var user = await _userService.RegisterAsync(createDto);

            // Generate token
            var token = _jwtService.GenerateToken(new User
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Role = Models.User.RoleUser
            });

            return Ok(new AuthResponseDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = Models.User.RoleUser,
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

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        var user = await _userService.LoginAsync(new LoginUserDto
        {
            Email = request.Email,
            Password = request.Password
        });

        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        var token = _jwtService.GenerateToken(new User
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Role = user.Role
        });

        return Ok(new AuthResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role,
            BonusBalance = user.BonusBalance,
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        });
    }

    
}