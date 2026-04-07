using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using System.Security.Cryptography;
using System.Text;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class UserService
{
    private readonly UserRepository _userRepository;
    private readonly AppDbContext _context;

    public UserService(UserRepository userRepository, AppDbContext context)
    {
        _userRepository = userRepository;
        _context = context;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => MapToDto(u)).ToList();
    }

    public async Task<UserDto?> GetUserByIdAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        return user == null ? null : MapToDto(user);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email);
        return user == null ? null : MapToDto(user);
    }

    public async Task<UserDto> RegisterAsync(CreateUserDto createDto)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(createDto.Email))
            throw new Exception("Email already exists");

        // Check if phone already exists
        if (await _userRepository.PhoneExistsAsync(createDto.Phone))
            throw new Exception("Phone already exists");

        // Check if username already exists
        if (await _userRepository.GetByUsernameAsync(createDto.Username) != null)
            throw new Exception("Username already exists");

        var user = new User
        {
            Username = createDto.Username,
            Phone = createDto.Phone,
            Email = createDto.Email,
            PasswordHash = HashPassword(createDto.Password),
            BonusBalance = 0
        };

        await _userRepository.AddAsync(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto?> LoginAsync(LoginUserDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email);
        if (user == null)
            return null;

        if (!VerifyPassword(loginDto.Password, user.PasswordHash))
            return null;

        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return null;

        if (!string.IsNullOrEmpty(updateDto.Username))
            user.Username = updateDto.Username;

        if (!string.IsNullOrEmpty(updateDto.Phone))
        {
            if (await _userRepository.PhoneExistsAsync(updateDto.Phone, id))
                throw new Exception("Phone already exists");
            user.Phone = updateDto.Phone;
        }

        if (!string.IsNullOrEmpty(updateDto.Email))
        {
            if (await _userRepository.EmailExistsAsync(updateDto.Email, id))
                throw new Exception("Email already exists");
            user.Email = updateDto.Email;
        }

        if (!string.IsNullOrEmpty(updateDto.Password))
            user.PasswordHash = HashPassword(updateDto.Password);

        _userRepository.Update(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return false;

        _userRepository.Delete(user);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<decimal> GetBonusBalanceAsync(int userId)
    {
        return await _userRepository.GetBonusBalanceAsync(userId);
    }

    private string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes);
    }

    private bool VerifyPassword(string password, string hash)
    {
        var hashedPassword = HashPassword(password);
        return hashedPassword == hash;
    }

    private UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Phone = user.Phone,
            Email = user.Email,
            BonusBalance = user.BonusBalance
        };
    }
}
