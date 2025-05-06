namespace Domain.Entities;

public class Poll
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    
    public DateTime CreatedAt { get; set; }
    
    public DateTime ExpiresAt { get; set; }
    
    public Guid CreatorId { get; set; }
    //TODO : Add Creator property
    
    public ICollection<PollOption> Options { get; set; } = null!;
    public ICollection<Vote> Votes { get; set; } = null!;
}