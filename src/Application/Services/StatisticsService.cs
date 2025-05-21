using Application.Repositories;
using Microsoft.Extensions.Logging;

namespace Application.Services;

public interface IStatisticsService
{
    Task<int> GetUserVotesTotalCountAsync(Guid userId);
    Task<double> GetMajorityMatchPercentageAsync(Guid userId);
}

public class StatisticsService : IStatisticsService
{
    private readonly IVoteRepository _voteRepository;
    private readonly IPollOptionRepository _pollOptionRepository;
    private readonly ILogger<StatisticsService> _logger;

    public StatisticsService(ILogger<StatisticsService> logger, IVoteRepository voteRepository, IPollOptionRepository pollOptionRepository)
    {
        _logger = logger;
        _voteRepository = voteRepository;
        _pollOptionRepository = pollOptionRepository;
    }
    
    public async Task<int> GetUserVotesTotalCountAsync(Guid userId)
    {
        try
        {
            return await _voteRepository.GetUserVotesTotalCountAsync(userId);
        }
        catch (Exception e)
        {
            _logger.LogError("Error while getting user votes total count: {Message}", e.Message);
            throw;
        }
    }
    
    // This method calculates the percentage of User Votes that match the majority option in each poll.
    // Unoptimized as hell, should rework it to be more efficient in the future.
    public async Task<double> GetMajorityMatchPercentageAsync(Guid userId)
    {
        try
        {
            var userVotes = await _voteRepository.GetVotesByUserIdAsync(userId);
            
            var pollIds = userVotes.Select(v => v.PollId).Distinct();

            int total = 0;
            int matches = 0;
            
            foreach (var pollId in pollIds)
            {
                var pollVotes = await _voteRepository.GetVotesByPollIdAsync(pollId);

                var groups = pollVotes.GroupBy(v => v.PollOptionId)
                    .Select(g => new { OptionId = g.Key, Count = g.Count() });
                
                var userVoteOptionId = userVotes.First(v => v.PollId == pollId).PollOptionId;
                
                var mostVotedOptionId = groups
                    .OrderByDescending(g => g.Count)
                    .First().OptionId;

                total++;
                if (userVoteOptionId == mostVotedOptionId)
                {
                    matches++;
                }
                
            }
            
            var matchPercentage = (double)matches / total * 100;
            
            return matchPercentage;
        }
        catch (Exception e)
        {
            _logger.LogError("Error while getting majority match percentage: {Message}", e.Message);
            throw;
        }
    }
}