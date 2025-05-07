using System.Collections;
using Domain.Entities;

namespace Domain.Interfaces;

//TODO need to get rid of this interface
public interface IUser
{
    public ICollection<Vote> GivenVotes { get; set; }
    public ICollection<Poll> CreatedPolls { get; set; }
}