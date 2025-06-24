namespace Infrastructure.Cache.Entities;

public class CachedPollOption
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public ICollection<CachedVote> Votes { get; set; } = new List<CachedVote>();
}