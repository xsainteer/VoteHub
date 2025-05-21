using Domain.Entities;

namespace Application.Repositories;

public interface IPollOptionRepository : IGenericRepository<PollOption>
{
    public Task<List<PollOption>> GetPollOptionsByPollIdAsync(Guid pollId, bool asNoTracking = false);
}