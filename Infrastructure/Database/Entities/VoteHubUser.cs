using System;
using System.Collections.Generic;
using Domain.Entities;
using Domain.Interfaces;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Database.Entities;

public class VoteHubUser : IdentityUser<Guid>
{
    public ICollection<Poll> CreatedPolls { get; set; } = [];
    public ICollection<Vote> GivenVotes { get; set; } = [];
}