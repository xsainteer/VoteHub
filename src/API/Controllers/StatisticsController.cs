using Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatisticsController : ControllerBase
{
    private readonly ILogger<StatisticsController> _logger;
    private readonly IStatisticsService _statisticsService;

    public StatisticsController(ILogger<StatisticsController> logger, IStatisticsService statisticsService)
    {
        _logger = logger;
        _statisticsService = statisticsService;
    }
    
    [HttpGet("user-votes-total-count/{userId}")]
    public async Task<IActionResult> GetUserVotesTotalCountAsync(Guid userId)
    {
        try
        {
            var count = await _statisticsService.GetUserVotesTotalCountAsync(userId);
            return Ok(count);
        }
        catch (Exception e)
        {
            _logger.LogError("Error while getting user votes total count: {Message}", e.Message);
            return StatusCode(500, "Internal server error");
        }
    }
    
    [HttpGet("majority-match-percentage/{userId}")]
    public async Task<IActionResult> GetMajorityMatchPercentageAsync(Guid userId)
    {
        try
        {
            var percentage = await _statisticsService.GetMajorityMatchPercentageAsync(userId);
            return Ok(percentage);
        }
        catch (Exception e)
        {
            _logger.LogError("Error while getting majority match percentage: {Message}", e.Message);
            return StatusCode(500, "Internal server error");
        }
    }
}