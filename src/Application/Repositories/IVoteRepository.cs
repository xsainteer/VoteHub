using Domain.Entities;

namespace Application.Repositories;

// TODO need to figure out how to make Vote repos and services to inherit from generic implementations
// Probably will need to create a repo and a service specific for Vote

public interface IVoteRepository
{
    public Task AddAsync(Vote vote);
    public Task SavesChangesAsync();
    Task<Vote?> GetVoteByUserAndPollAsync(Guid currentUserId, Guid entityPollId);
    Task UpdateAsync(Vote userVote);
}

