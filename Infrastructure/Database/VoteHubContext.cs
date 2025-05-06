using Domain.Entities;
using Infrastructure.Database.Configurations;
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
        builder.ApplyConfiguration(new VoteConfiguration());
        builder.ApplyConfiguration(new PollConfiguration());
        builder.ApplyConfiguration(new PollOptionConfiguration());
        base.OnModelCreating(builder);
    }
}