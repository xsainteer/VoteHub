using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;

// that class represents relationship of user + poll to chosen poll's option
public class Vote
{
    [Required]
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    [Required]
    public Guid PollOptionId { get; set; }
    public PollOption PollOption { get; set; } = null!;

    [Required]
    public Guid UserId { get; set; }
    
    public DateTime VotedAt { get; set; } = DateTime.Now.ToUniversalTime();
}