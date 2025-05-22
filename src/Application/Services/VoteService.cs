using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IVoteService
{
    Task AddVoteAsync(Vote vote);
    Task<Vote?> GetVoteByUserIdAndPollIdAsync(Guid currentUserId, Guid entityPollId);
    Task SaveChangesAsync();
    Task UpdateVoteAsync(Vote userVote);
    Task<int> GetVotesCountByPollOptionIdAsync(Guid pollOptionId);
}

public class VoteService : IVoteService
{
    private readonly IVoteRepository _voteRepository;
    private readonly ILogger<VoteService> _logger;

    public VoteService(IVoteRepository voteRepository, ILogger<VoteService> logger)
    {
        _voteRepository = voteRepository;
        _logger = logger;
    }

    public async Task AddVoteAsync(Vote vote)
    {
        try
        {
            await _voteRepository.AddAsync(vote);
            await _voteRepository.SavesChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("Error adding vote: {Message}", e.Message);
            throw;
        }
    }

    public async Task<Vote?> GetVoteByUserIdAndPollIdAsync(Guid currentUserId, Guid entityPollId)
    {
        try
        {
            var vote = await _voteRepository.GetVoteAsync(v => v.UserId == currentUserId && v.PollId == entityPollId, true);
            return vote;
        }
        catch (Exception e)
        {
            _logger.LogError("Error fetching vote: {Message}", e.Message);
            throw;
        }
    }

    public async Task SaveChangesAsync()
    {
        try
        {
            await _voteRepository.SavesChangesAsync();
        }
        catch (Exception e)
        {
            _logger.LogError("Error saving vote: {Message}", e.Message);
            throw;
        }
    }

    public async Task UpdateVoteAsync(Vote userVote)
    {
        try
        {
            await _voteRepository.UpdateAsync(userVote);
        }
        catch (Exception e)
        {
            _logger.LogError("Error updating vote: {Message}", e.Message);
            throw;
        }
    }

    public async Task<int> GetVotesCountByPollOptionIdAsync(Guid pollOptionId)
    {
        try
        {
            return await _voteRepository.GetUserVotesTotalCountAsync(pollOptionId);
        }
        catch (Exception e)
        {
            _logger.LogError("Error fetching votes count: {Message}", e.Message);
            throw;
        }
    }
}