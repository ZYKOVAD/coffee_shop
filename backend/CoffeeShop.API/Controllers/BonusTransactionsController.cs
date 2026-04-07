using Microsoft.AspNetCore.Mvc;
using CoffeeShop.API.Services;
using CoffeeShop.API.DTO;

namespace CoffeeShop.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BonusTransactionsController : ControllerBase
{
    private readonly BonusTransactionService _bonusTransactionService;

    public BonusTransactionsController(BonusTransactionService bonusTransactionService)
    {
        _bonusTransactionService = bonusTransactionService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var transactions = await _bonusTransactionService.GetAllTransactionsAsync();
        return Ok(transactions);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var transaction = await _bonusTransactionService.GetTransactionByIdAsync(id);
        if (transaction == null)
            return NotFound(new { message = $"Transaction with id {id} not found" });
        return Ok(transaction);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetByUser(int userId)
    {
        var transactions = await _bonusTransactionService.GetUserTransactionsAsync(userId);
        return Ok(transactions);
    }

    [HttpGet("user/{userId}/summary")]
    public async Task<IActionResult> GetUserSummary(int userId)
    {
        var summary = await _bonusTransactionService.GetUserBonusSummaryAsync(userId);
        return Ok(summary);
    }
}