namespace Domain.Entities;

public class PollOption
{
    public int Id { get; set; }
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;
    
    public string Text { get; set; } = null!;
}