using Domain.Entities;
using Infrastructure.Database.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Database.Configurations;

public class PollConfiguration : IEntityTypeConfiguration<Poll>
{
    public void Configure(EntityTypeBuilder<Poll> builder)
    {
        builder.Property(p => p.Name).HasMaxLength(150);
        builder.Property(p => p.Description).HasMaxLength(500);

        builder.HasOne<VoteHubUser>()
            .WithMany(u => u.CreatedPolls)
            .HasForeignKey(p => p.CreatorId);
    }
}