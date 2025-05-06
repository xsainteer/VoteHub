using Domain.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Database.Entities;

public class VoteHubUser : IdentityUser<Guid>
{
    public string Nickname { get; set; } = null!;
    public ICollection<Poll> CreatedPolls { get; set; } = new List<Poll>();
    public ICollection<Poll> ParticipatedPolls { get; set; } = new List<Poll>();
}