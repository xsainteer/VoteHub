using System.Linq.Expressions;
using Domain.Entities;

namespace Application.Repositories;

public interface IPollOptionRepository : IGenericRepository<PollOption>
{
    public Task<List<PollOption>> GetPollOptionsAsync(Expression<Func<PollOption, bool>> predicate, bool asNoTracking = false);
}