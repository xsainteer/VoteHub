using System.Security.Claims;
using API.DTOs;
using Application.Services;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Domain.Entities;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class VoteController : ControllerBase
{
    private readonly ILogger<VoteController> _logger;
    private readonly IVoteService _voteService;
    private readonly IMapper _mapper;

    public VoteController(ILogger<VoteController> logger, IVoteService voteService, IMapper mapper)
    {
        _logger = logger;
        _voteService = voteService;
        _mapper = mapper;
    }
    

    [HttpPost]
    public async Task<IActionResult> AddVote([FromBody] VoteCreateDto dto)
    {
        try
        {
            var user = HttpContext.User;
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var guidParsingResult = Guid.TryParse(userId, out var parsedUserId);

            if (!guidParsingResult)
            {
                return BadRequest("Can not parse userId from token");
            }
            
            var vote = _mapper.Map<Vote>(dto);
            vote.UserId = parsedUserId;
            await _voteService.AddVoteAsync(vote);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "error adding vote");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetVote([FromQuery] Guid currentUserId, [FromQuery] Guid entityPollId)
    {
        try
        {
            var vote = await _voteService.GetVoteByUserIdAndPollIdAsync(currentUserId, entityPollId);
            if (vote == null)
            {
                _logger.LogInformation("Vote not found.");
                return NotFound();
            }
            return Ok(vote);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred in GetVote method.");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [HttpPut]
    public async Task<IActionResult> UpdateVote([FromBody] VoteUpdateDto dto)
    {
        try
        {
            var user = HttpContext.User;
            var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var guidParsingResult = Guid.TryParse(userId, out var parsedUserId);

            if (!guidParsingResult)
            {
                return BadRequest("Can not parse userId from token");
            }
            
            var vote = _mapper.Map<Vote>(dto);
            vote.UserId = parsedUserId;
            await _voteService.UpdateVoteAsync(vote);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating vote.");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }

    [HttpGet("poll-option/vote-count")]
    public async Task<IActionResult> GetVotesCountByPollOption([FromQuery] Guid pollOptionId)
    {
        try
        {
            var count = await _voteService.GetVotesCountByPollOptionIdAsync(pollOptionId);
            return Ok(count);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting votesCount.");
            return StatusCode(500, "An error occurred while processing your request.");
        }
    }
}
