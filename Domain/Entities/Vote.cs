namespace Domain.Entities;

public class Vote
{
    public int Id { get; set; }
    public int PollId { get; set; }
    public int PollOptionId { get; set; }
    public DateTime CreatedAt { get; set; }
    public int UserId { get; set; }
}