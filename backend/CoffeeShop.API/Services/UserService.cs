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

    public async Task<List<UserDto>> GetAllUsersWithRolesAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => MapToDto(u)).ToList();
    }

    public async Task<List<UserDto>> GetAllBaristasAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users
            .Where(u => u.Role == User.RoleBarista)
            .Select(u => MapToDto(u))
            .ToList();
    }

    public async Task<UserDto?> ChangeUserRoleAsync(int userId, string newRole)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            return null;

        var validRoles = new[] { User.RoleUser, User.RoleBarista, User.RoleAdmin };
        if (!validRoles.Contains(newRole))
            throw new Exception($"Invalid role. Allowed: {string.Join(", ", validRoles)}");

        user.Role = newRole;
        _userRepository.Update(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto> RegisterAsync(CreateUserDto createDto)
    {
        if (string.IsNullOrWhiteSpace(createDto.Email))
            throw new Exception("Email is required");

        if (string.IsNullOrWhiteSpace(createDto.Password))
            throw new Exception("Password is required");

        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(createDto.Email))
            throw new Exception("Email already exists");

        // Check if phone already exists
        if (!string.IsNullOrWhiteSpace(createDto.Phone))
        {
            if (await _userRepository.PhoneExistsAsync(createDto.Phone))
                throw new Exception("Phone already exists");
        }

        string username;
        if (!string.IsNullOrWhiteSpace(createDto.Username))
            username = createDto.Username;
        else username = createDto.Email.Split('@')[0];

        var user = new User
        {
            Username = username,
            Phone = createDto.Phone,
            Email = createDto.Email,
            PasswordHash = HashPassword(createDto.Password),
            BonusBalance = 0,
            Role = User.RoleUser
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

    // Создание администратора
    public async Task<UserDto> CreateAdminAsync(CreateUserDto createDto)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(createDto.Email))
            throw new Exception("Email already exists");

        // Check if phone already exists
        if (createDto.Phone != null)
            if (await _userRepository.PhoneExistsAsync(createDto.Phone))
                throw new Exception("Phone already exists");

        var user = new User
        {
            Username = createDto.Username,
            Phone = createDto.Phone,
            Email = createDto.Email,
            PasswordHash = HashPassword(createDto.Password),
            BonusBalance = 0,
            Role = User.RoleAdmin  
        };

        await _userRepository.AddAsync(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto> CreateBaristaAsync(CreateUserDto createDto)
    {
        // Check if email already exists
        if (await _userRepository.EmailExistsAsync(createDto.Email))
            throw new Exception("Email already exists");

        // Check if phone already exists
        if (createDto.Phone != null)
            if (await _userRepository.PhoneExistsAsync(createDto.Phone))
                throw new Exception("Phone already exists");

        var user = new User
        {
            Username = createDto.Username,
            Phone = createDto.Phone,
            Email = createDto.Email,
            PasswordHash = HashPassword(createDto.Password),
            BonusBalance = 0,
            Role = User.RoleBarista
        };

        await _userRepository.AddAsync(user);
        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<UserDto?> UpdateUserAsync(int id, UpdateUserDto updateDto)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            return null;

        user.Username = updateDto.Username;
        user.Phone = updateDto.Phone;
        if (!string.IsNullOrWhiteSpace(updateDto.Email))
        {
            var existingUser = await _userRepository.GetByEmailAsync(updateDto.Email);
            if (existingUser != null && existingUser.Id != id)
                throw new Exception($"Email {updateDto.Email} is already taken");
            user.Email = updateDto.Email;
        }
            
        if (!string.IsNullOrWhiteSpace(updateDto.Password))
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

    private static string HashPassword(string password)
    {
        using var sha256 = SHA256.Create();
        var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
        return Convert.ToBase64String(hashedBytes); 
    }

    private static bool VerifyPassword(string password, string hash)
    {
        var hashedPassword = HashPassword(password);
        return hashedPassword == hash;
    }

    private static UserDto MapToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Phone = user.Phone,
            Email = user.Email,
            Role = user.Role,
            BonusBalance = user.BonusBalance
        };
    }
}
