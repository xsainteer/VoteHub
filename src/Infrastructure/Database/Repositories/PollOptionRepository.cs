using System.Linq.Expressions;
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

    public async Task<List<PollOption>> GetPollOptionsAsync(Expression<Func<PollOption, bool>> predicate, bool asNoTracking = false)
    {
        _logger.LogInformation("Getting poll options with predicate: {Predicate}", predicate);
        
        var queryable = asNoTracking ? _dbSet.AsNoTracking() : _dbSet;
        
        return await queryable
            .Where(predicate)
            .ToListAsync();
    }
}