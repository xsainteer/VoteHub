using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IPollOptionService
{
    Task<List<PollOption>> GetPollOptionsByPollIdAsync(Guid pollId);
}

public class PollOptionService : GenericService<PollOption>, IPollOptionService
{
    // another repository for poll options specific methods
    private readonly IPollOptionRepository _pollOptionRepository;


    public PollOptionService(IGenericRepository<PollOption> repository, IPollOptionRepository pollOptionRepository, ILogger<PollOptionService> logger)
        : base(repository, logger)
    {
        _pollOptionRepository = pollOptionRepository;
    }

    public async Task<List<PollOption>> GetPollOptionsByPollIdAsync(Guid pollId)
    {
        try
        {
            return await _pollOptionRepository.GetPollOptionsByPollIdAsync(pollId);
        }
        catch (Exception e)
        {
            _logger.LogError("error getting poll options by poll id {pollId}: {ErrorMessage}", pollId, e.Message);
            throw;
        }
    }
}