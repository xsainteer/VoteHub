using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;


public class Poll : IHasId, IHasName
{
    [Key]
    public Guid Id { get; set; }
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = null!;
    
    [StringLength(500)]
    public string Description { get; set; } = null!;

    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.Now.ToUniversalTime();
    
    public DateTime? ExpiresAt { get; set; }
    
    [Required]
    public Guid CreatorId { get; set; }
    
    public ICollection<PollOption> Options { get; set; } = [];
    public ICollection<Vote> Participants { get; set; } = [];
}