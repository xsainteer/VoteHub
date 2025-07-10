using Domain.Entities;

namespace Application.Interfaces;

public interface ICacheService
{
    Task AddPollAsync(Poll poll);
    Task<Poll?> GetPollAsync(Guid pollId);
    Task UpdatePollAsync(Poll poll);
    Task DeletePollAsync(Guid pollId);

    public Task AddVoteAsync(Vote vote);
    public Task<Vote?> GetVoteAsync(Guid pollId, Guid userId);
    public Task UpdateVoteAsync(Vote vote);
    public Task DeleteVoteAsync(Guid pollId, Guid userId);
}