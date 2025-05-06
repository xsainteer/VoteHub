using System.Collections;
using Domain.Entities;

namespace Domain.Interfaces;

public interface IUser
{
    public string Nickname { get; set; }
    public ICollection<Vote> GivenVotes { get; set; }
    public ICollection<Poll> CreatedPolls { get; set; }
}