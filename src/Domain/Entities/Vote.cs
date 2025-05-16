namespace Domain.Entities;

// that class represents relationship of user + poll to chosen poll's option
public class Vote
{
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public Guid PollOptionId { get; set; }
    public PollOption PollOption { get; set; } = null!;

    public Guid UserId { get; set; }
    
    public DateTime VotedAt { get; set; }
}