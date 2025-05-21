using Application.Interfaces;
using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IPollService : IGenericService<Poll>
{
    Task<Poll?> GetPollWithOptionsAsync(Guid pollId);
}

public class PollService : GenericService<Poll>, IPollService
{
    private readonly IPollRepository _pollRepository;
    public PollService(IPollRepository repository, ILogger<PollService> logger) : base(repository, logger)
    {
        _pollRepository = repository;
    }
    
    public async Task<Poll?> GetPollWithOptionsAsync(Guid pollId)
    {
        try
        {
            return await _pollRepository.GetPollWithOptionsAsync(pollId);
        }
        catch (Exception e)
        {
            _logger.LogError("Error while getting poll with options: {Message}", e.Message);
            throw;
        }
    }
}