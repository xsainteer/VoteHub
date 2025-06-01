using System.Linq.Expressions;
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
    
    public async Task<int> GetUserVotesTotalCountAsync(Guid userId)
    {
        _logger.LogInformation("Getting total votes count for UserId: {UserId}", userId);
        
        var count = await _dbSet.CountAsync(v => v.UserId == userId);
        
        return count;
    }

    public async Task<List<Vote>> GetVotesAsync(Expression<Func<Vote, bool>> predicate, bool asNoTracking = false)
    {
        _logger.LogInformation("Getting votes with custom predicate: {Predicate}", predicate);
        
        var queryable = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
        
        return await queryable
            .Where(predicate)
            .ToListAsync();
    }

    public async Task<Vote> GetVoteAsync(Expression<Func<Vote, bool>> predicate, bool asNoTracking = false)
    {
        _logger.LogInformation("Getting a vote with custom predicate: {Predicate}", predicate);
        
        var queryable = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
        
        return await queryable
            .Where(predicate)
            .FirstAsync();
    }

    public async Task<int> GetVotesCountByPollOptionIdAsync(Guid pollOptionId)
    {
        _logger.LogInformation("Fetching votes count for poll option ID {PollOptionId}", pollOptionId);
        
        return await _dbSet
            .CountAsync(v => v.PollOptionId == pollOptionId);
    }
    public async Task DeleteAsync(Guid voteId)
    {
        _logger.LogInformation("Deleting vote with ID: {VoteId}", voteId);

        var vote = await _dbSet.FindAsync(voteId);
        if (vote != null)
        {
            _dbSet.Remove(vote);
        }
        else
        {
            _logger.LogWarning("Vote with ID: {VoteId} not found", voteId);
        }
    }
}
