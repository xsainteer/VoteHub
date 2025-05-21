using Application.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database.Repositories;

public class PollOptionRepository : GenericRepository<PollOption>, IPollOptionRepository
{
    public PollOptionRepository(VoteHubContext context, ILogger<PollOptionRepository> logger) : base(context, logger)
    {
    }

    public async Task<List<PollOption>> GetPollOptionsByPollIdAsync(Guid pollId, bool asNoTracking = false)
    {
        _logger.LogInformation("Fetching poll options for poll ID {PollId}", pollId);
        
        var queryable = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
        
        return await queryable
            .Where(p => p.PollId == pollId)
            .ToListAsync();
    }
}