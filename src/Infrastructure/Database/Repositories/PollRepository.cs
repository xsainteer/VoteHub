using Application.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database.Repositories;

public class PollRepository : GenericRepository<Poll>, IPollRepository
{
    public PollRepository(VoteHubContext context, ILogger<GenericRepository<Poll>> logger) : base(context, logger)
    {
    }
    
    public async Task<Poll?> GetPollWithOptionsAsync(Guid pollId)
    {
        return await _dbSet
            .Include(p => p.Options)
            .FirstOrDefaultAsync(p => p.Id == pollId);
    }
}
