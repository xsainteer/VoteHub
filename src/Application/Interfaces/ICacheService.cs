using Domain.Entities;

namespace Application.Interfaces;

public interface ICacheService
{
    Task AddPollAsync(Poll poll);
    Task<Poll?> GetPollAsync(Guid pollId);
    Task UpdatePollAsync(Poll poll);
    Task DeletePollAsync(Guid pollId);
}