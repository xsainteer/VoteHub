using Domain.Entities;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Database;

public class VoteHubContext : IdentityDbContext<VoteHubUser, IdentityRole<Guid>, Guid>
{
    public VoteHubContext() {}
    public VoteHubContext(DbContextOptions<VoteHubContext> options) : base(options)
    {
    }
    
    public DbSet<Poll> Polls { get; set; }
    public DbSet<PollOption> PollOptions { get; set; }
    public DbSet<Vote> Votes { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}