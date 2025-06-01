namespace API.DTOs;

// CreateDto for PollOption
public class PollOptionCreateDto
{
    public string Name { get; set; } = string.Empty;
    public int PollId { get; set; } // Reference to the parent Poll
}

// ReadDto for PollOption
public class PollOptionReadDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int VotesCount { get; set; } // Count of votes for this option
    public int PollId { get; set; }
}

// UpdateDto for PollOption
public class PollOptionUpdateDto
{
    public int Id { get; set; }
    public string? Name { get; set; }
}