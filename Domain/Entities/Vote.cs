namespace Domain.Entities;

public class Vote
{
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public Guid PollOptionId { get; set; }
    public PollOption PollOption { get; set; } = null!;

    public Guid UserId { get; set; }
    // TODO : Add User property
    
    public DateTime VotedAt { get; set; }
    
}