using Domain.Interfaces;

namespace Domain.Entities;

public class Poll : IHasId, IHasName
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string Description { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
    
    public DateTime? ExpiresAt { get; set; }
    
    public Guid CreatorId { get; set; }
    
    public ICollection<PollOption> Options { get; set; } = null!;
    public ICollection<Vote> Participants { get; set; } = null!;
}