using Application.Repositories;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database.Repositories;

public class PollOptionRepository : GenericRepository<PollOption>, IPollOptionRepository
{
    private readonly VoteHubContext _context;
    private readonly ILogger<PollOptionRepository> _logger;


    public PollOptionRepository(VoteHubContext context, ILogger<GenericRepository<PollOption>> logger, ILogger<PollOptionRepository> logger2) : base(context, logger)
    {
        _context = context;
        _logger = logger2;
    }

    public async Task<List<PollOption>> GetPollOptionsByPollIdAsync(Guid pollId)
    {
        try
        {
            var pollOptions = await _context.PollOptions
                .Where(x => x.PollId == pollId)
                .ToListAsync();
            return pollOptions;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Error fetching poll options for poll ID {PollId}", pollId);
            throw;
        }
    }
}