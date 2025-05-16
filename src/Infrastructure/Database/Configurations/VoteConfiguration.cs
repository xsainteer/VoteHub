using Domain.Entities;
using Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class VoteConfiguration : IEntityTypeConfiguration<Vote>
{
    public void Configure(EntityTypeBuilder<Vote> builder)
    {
        builder.HasKey(v => new { v.UserId, v.PollId });

        builder.HasOne<VoteHubUser>()
            .WithMany(u => u.GivenVotes)
            .HasForeignKey(v => v.UserId);

        builder.HasOne(v => v.Poll)
            .WithMany(p => p.Participants)
            .HasForeignKey(v => v.PollId);

        builder.HasOne(v => v.PollOption)
            .WithMany(po => po.Votes)
            .HasForeignKey(v => v.PollOptionId);
    }
}