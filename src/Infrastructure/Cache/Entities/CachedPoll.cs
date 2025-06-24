namespace Infrastructure.Cache.Entities;

public class CachedPoll
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now.ToUniversalTime();
    public DateTime? ExpiresAt { get; set; }
    public Guid CreatorId { get; set; }
    public ICollection<CachedPollOption> Options { get; set; } = new List<CachedPollOption>();
}