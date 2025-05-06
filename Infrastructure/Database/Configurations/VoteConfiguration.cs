using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class VoteConfiguration : IEntityTypeConfiguration<Vote>
{
    public void Configure(EntityTypeBuilder<Vote> builder)
    {
        builder.HasKey(v => new { v.UserId, v.PollId });

        builder.HasOne(v => v.User)
            .WithMany(u => u.GivenVotes)
            .HasForeignKey(v => v.UserId);

        builder.HasOne(v => v.Poll)
            .WithMany(p => p.Participants)
            .HasForeignKey(v => v.PollId);
    }
}