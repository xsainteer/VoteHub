namespace Infrastructure.Cache.Entities;

public class CachedVote
{
    public Guid PollId { get; set; }
    
    public Guid PollOptionId { get; set; }
    
    public Guid UserId { get; set; }
    
    public DateTime VotedAt { get; set; } = DateTime.Now.ToUniversalTime();
}