using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;
using Microsoft.AspNetCore.Authorization;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly UserService _userService;

    public UsersController(UserService userService)
    {
        _userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
        if (user == null)
            return NotFound(new { message = $"User with id {id} not found" });
        return Ok(user);
    }

    [HttpGet("email/{email}")]
    [Authorize(Roles = "admin")]
    public async Task<IActionResult> GetByEmail(string email)
    {
        var user = await _userService.GetUserByEmailAsync(email);
        if (user == null)
            return NotFound(new { message = $"User with email {email} not found" });
        return Ok(user);
    }

    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateUserDto updateDto)
    {
        try
        {
            var user = await _userService.UpdateUserAsync(id, updateDto);
            if (user == null)
                return NotFound(new { message = $"User with id {id} not found" });
            return Ok(user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _userService.DeleteUserAsync(id);
        if (!result)
            return NotFound(new { message = $"User with id {id} not found" });
        return NoContent();
    }

    [HttpGet("{id}/bonus")]
    [Authorize]
    public async Task<IActionResult> GetBonusBalance(int id)
    {
        var balance = await _userService.GetBonusBalanceAsync(id);
        return Ok(new { userId = id, bonusBalance = balance });
    }
}