using Domain.Entities;

namespace Application.Repositories;

public interface IPollRepository : IGenericRepository<Poll>
{
    Task<Poll?> GetPollWithOptionsAsync(Guid pollId);
}