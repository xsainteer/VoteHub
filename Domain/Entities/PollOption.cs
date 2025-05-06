using System.Collections;
using Domain.Interfaces;

namespace Domain.Entities;

public class PollOption
{
    public int Id { get; set; }
    
    public string Text { get; set; } = null!;
    
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public ICollection<IUser> SelectedByUsers { get; set; } = [];
}