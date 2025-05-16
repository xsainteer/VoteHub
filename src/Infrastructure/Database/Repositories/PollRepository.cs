using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Infrastructure.Database.Repositories;

public class PollRepository : GenericRepository<Poll>, IPollRepository
{
    private readonly VoteHubContext _context;
    
    public PollRepository(VoteHubContext context, ILogger<GenericRepository<Poll>> logger) : base(context, logger)
    {
        _context = context;
    }
    
    //logic, that is not already implemented by generic repository
}
