using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IVoteService
{
    Task AddVoteAsync(Vote vote);
    Task<Vote?> GetVoteByUserAndPollAsync(Guid currentUserId, Guid entityPollId);
    Task SaveChangesAsync();
    Task UpdateVoteAsync(Vote userVote);
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

    public async Task<Vote?> GetVoteByUserAndPollAsync(Guid currentUserId, Guid entityPollId)
    {
        try
        {
            var vote = await _voteRepository.GetVoteByUserAndPollAsync(currentUserId, entityPollId);
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
}