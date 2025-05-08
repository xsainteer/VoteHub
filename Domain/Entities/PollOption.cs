namespace Domain.Entities;

public class PollOption
{
    public Guid Id { get; set; }
    
    public string Text { get; set; } = null!;
    
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public ICollection<Vote> Votes { get; set; } = [];
}