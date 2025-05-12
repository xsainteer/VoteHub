using Domain.Interfaces;

namespace Application.Repositories;

public interface IGenericRepository<T> where T : IHasId
{
    Task<T?> GetByIdAsync(Guid id);
    Task<List<T>> GetAllAsync(int skip, int count, bool asNoTracking = false, string query = "");
    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    Task UpdateAsync(T entity);
    Task UpdateChangedFieldsAsync(T entity);
    Task DeleteAsync(Guid id);
    Task SaveChangesAsync();
}