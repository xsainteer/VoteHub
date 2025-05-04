namespace Domain.Entities;

public class Poll
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public bool IsMultipleChoice { get; set; }
    public DateTime CreatedAt { get; set; }
}