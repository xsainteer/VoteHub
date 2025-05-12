using Domain.Interfaces;

namespace Domain.Entities;

public class PollOption : IHasId, IHasName
{
    public Guid Id { get; set; }
    
    public string Name { get; set; } = null!;
    
    public string Description { get; set; } = null!;
    
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public ICollection<Vote> Votes { get; set; } = [];
}