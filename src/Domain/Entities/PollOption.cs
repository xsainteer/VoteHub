using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Domain.Interfaces;

namespace Domain.Entities;


public class PollOption : IHasId, IHasName
{
    public Guid Id { get; set; }
    [Required]
    [StringLength(400)]
    public string Name { get; set; } = null!;
    
    public string? Description { get; set; }
    
    public Guid PollId { get; set; }
    public Poll Poll { get; set; } = null!;

    public ICollection<Vote> Votes { get; set; } = [];
}