using System.Linq.Expressions;
using Domain.Entities;

namespace Application.Repositories;

public interface IVoteRepository
{
    public Task AddAsync(Vote vote);
    public Task SavesChangesAsync();
    Task UpdateAsync(Vote userVote);
    Task<int> GetUserVotesTotalCountAsync(Guid userId);
    Task<List<Vote>> GetVotesAsync(Expression<Func<Vote, bool>> predicate, bool asNoTracking = false);
    Task<Vote> GetVoteAsync(Expression<Func<Vote, bool>> predicate, bool asNoTracking = false);
    Task<int> GetVotesCountByPollOptionIdAsync(Guid pollOptionId);
}