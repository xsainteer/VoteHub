using Application.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database.Repositories;

public class VoteRepository : IVoteRepository
{
    private readonly VoteHubContext _context;
    private readonly ILogger<VoteRepository> _logger;
    private readonly DbSet<Vote> _dbSet;

    public VoteRepository(ILogger<VoteRepository> logger, VoteHubContext context)
    {
        _logger = logger;
        _context = context;
        _dbSet = context.Set<Vote>();
    }

    public async Task AddAsync(Vote vote)
    {
        _logger.LogInformation("Adding vote for PollId: {PollId}, PollOptionId: {PollOptionId}, UserId: {UserId}", 
            vote.PollId, vote.PollOptionId, vote.UserId);
        await _dbSet.AddAsync(vote);
    }

    public async Task SavesChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    public async Task<Vote?> GetVoteByUserAndPollAsync(Guid currentUserId, Guid entityPollId)
    {
        _logger.LogInformation("Getting vote for UserId: {UserId}, PollId: {PollId}",
            currentUserId, entityPollId);
        
        
        var vote = await _dbSet.FindAsync(currentUserId, entityPollId);
        
        return vote;
    }

    public async Task UpdateAsync(Vote userVote)
    {
        // Maybe sometime i will make a method for updating specific properties instead of a whole entity for optimization
        
        _logger.LogInformation("Updating vote for PollId: {PollId}, UserId: {UserId}",
            userVote.PollId, userVote.UserId);
        
        var entry = _context.Entry(userVote);
        if (entry.State == EntityState.Detached)
        {
            _logger.LogWarning("Vote entity was detached, attaching it now.");
            _dbSet.Attach(userVote);
        }
        
        entry.State = EntityState.Modified;
    }
}