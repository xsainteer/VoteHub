namespace Infrastructure.Cache.Entities;

public class CachedPollOption
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    
    // The number of votes this option has received
    public int VotesCount { get; set; } = 0;
}