using Application.Interfaces;
using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IPollService : IGenericService<Poll>
{
    // additional methods if needed
}

public class PollService : GenericService<Poll>, IPollService
{
    public PollService(IGenericRepository<Poll> repository, ILogger<GenericService<Poll>> logger) : base(repository, logger)
    {
    }
    
    // additional methods if needed
}