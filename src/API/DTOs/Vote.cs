namespace API.DTOs;

// CreateDto for Vote
public class VoteCreateDto
{
    public int PollOptionId { get; set; } // The option the user voted for
    public int PollId { get; set; } // Reference to the Poll
}

// ReadDto for Vote
public class VoteReadDto
{
    public int PollOptionId { get; set; } // The option voted for
    public int PollId { get; set; } // Reference to the Poll
    public Guid UserId { get; set; } // The ID of the user who voted
    public DateTime CreatedAt { get; set; } // When the vote was made
}

// UpdateDto for Vote
public class VoteUpdateDto
{
    public int PollOptionId { get; set; }
    public int PollId { get; set; }
}