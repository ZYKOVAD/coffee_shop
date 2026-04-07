using Microsoft.EntityFrameworkCore;
using CoffeeShop.API.Models;
using CoffeeShop.API.Repositories;
using CoffeeShop.API.DTO;
using CoffeeShop.API.Data;

namespace CoffeeShop.API.Services;

public class BonusTransactionService
{
    private readonly BonusTransactionRepository _bonusTransactionRepository;
    private readonly UserRepository _userRepository;
    private readonly AppDbContext _context;

    public BonusTransactionService(
        BonusTransactionRepository bonusTransactionRepository,
        UserRepository userRepository,
        AppDbContext context)
    {
        _bonusTransactionRepository = bonusTransactionRepository;
        _userRepository = userRepository;
        _context = context;
    }

    public async Task<List<BonusTransactionDto>> GetAllTransactionsAsync()
    {
        var transactions = await _bonusTransactionRepository.GetAllAsync();
        return transactions.Select(t => MapToDto(t)).ToList();
    }

    public async Task<BonusTransactionDto?> GetTransactionByIdAsync(int id)
    {
        var transaction = await _bonusTransactionRepository.GetByIdAsync(id);
        return transaction == null ? null : MapToDto(transaction);
    }

    public async Task<List<BonusTransactionDto>> GetUserTransactionsAsync(int userId)
    {
        var transactions = await _bonusTransactionRepository.GetByUserIdAsync(userId);
        return transactions.Select(t => MapToDto(t)).ToList();
    }

    public async Task<BonusTransactionSummaryDto> GetUserBonusSummaryAsync(int userId)
    {
        var totalAccrued = await _bonusTransactionRepository.GetTotalAccruedAsync(userId);
        var totalRedeemed = await _bonusTransactionRepository.GetTotalRedeemedAsync(userId);
        var currentBalance = await _userRepository.GetBonusBalanceAsync(userId);

        return new BonusTransactionSummaryDto
        {
            TotalAccrued = totalAccrued,
            TotalRedeemed = totalRedeemed,
            CurrentBalance = currentBalance
        };
    }

    public async Task<BonusTransactionDto> AccrueBonusesAsync(int userId, int orderId, decimal amount, string description)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception($"User with id {userId} not found");

        var transaction = new BonusTransaction
        {
            UserId = userId,
            OrderId = orderId,
            Amount = amount,
            Type = "accrual",
            CreatedAt = DateTime.UtcNow
        };

        // Update user balance
        user.BonusBalance += amount;
        _userRepository.Update(user);

        await _bonusTransactionRepository.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return MapToDto(transaction);
    }

    public async Task<BonusTransactionDto> RedeemBonusesAsync(int userId, int orderId, decimal amount, string description)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null)
            throw new Exception($"User with id {userId} not found");

        if (user.BonusBalance < amount)
            throw new Exception("Insufficient bonus balance");

        var transaction = new BonusTransaction
        {
            UserId = userId,
            OrderId = orderId,
            Amount = amount,
            Type = "redemption",
            CreatedAt = DateTime.UtcNow
        };

        // Update user balance
        user.BonusBalance -= amount;
        _userRepository.Update(user);

        await _bonusTransactionRepository.AddAsync(transaction);
        await _context.SaveChangesAsync();

        return MapToDto(transaction);
    }

    private BonusTransactionDto MapToDto(BonusTransaction transaction)
    {
        return new BonusTransactionDto
        {
            Id = transaction.Id,
            UserId = transaction.UserId,
            OrderId = transaction.OrderId,
            Amount = transaction.Amount,
            Type = transaction.Type,
            CreatedAt = transaction.CreatedAt
        };
    }
}
