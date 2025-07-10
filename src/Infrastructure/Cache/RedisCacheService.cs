using AutoMapper;
using Domain.Entities;
using Infrastructure.Cache.Entities;
using Newtonsoft.Json;
using Application.Interfaces;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

namespace Infrastructure.Cache;

public class RedisCacheService : ICacheService
{
    private readonly ILogger<RedisCacheService> _logger;
    private readonly IDatabase _cache;
    private readonly IMapper _mapper;
    
    public RedisCacheService(IConnectionMultiplexer connectionMultiplexer, ILogger<RedisCacheService> logger, IMapper mapper)
    {
        _cache = connectionMultiplexer.GetDatabase();
        _logger = logger;
        _mapper = mapper;
    }   

    public async Task AddPollAsync(Poll poll)
    {
        var key = $"poll:{poll.Id}";
        var cachedPoll = _mapper.Map<CachedPoll>(poll);
        var value = JsonConvert.SerializeObject(cachedPoll);
        await _cache.StringSetAsync(key, value);
        _logger.LogInformation("Poll with ID {Id} saved to cache.", poll.Id);
    }
    
    public async Task<Poll?> GetPollAsync(Guid pollId)
    {
        var key = $"poll:{pollId}";
        var value = await _cache.StringGetAsync(key);
    
        if (string.IsNullOrEmpty(value))
        {
            _logger.LogWarning("Poll with ID {Id} not found in cache.", pollId);
            return null;
        }
    
        var cachedPoll = JsonConvert.DeserializeObject<CachedPoll>(value);
        _logger.LogInformation("Poll with ID {Id} retrieved from cache.", pollId);
    
        return cachedPoll is null ? null : _mapper.Map<Poll>(cachedPoll);
    }
    
    public async Task UpdatePollAsync(Poll poll)
    {
        var key = $"poll:{poll.Id}";
    
        var cachedPoll = _mapper.Map<CachedPoll>(poll);
        
        if (!await _cache.KeyExistsAsync(key))
        {
            _logger.LogWarning("Poll with ID {Id} does not exist in cache.", poll.Id);
            return;
        }
    
        var value = JsonConvert.SerializeObject(cachedPoll);
        await _cache.StringSetAsync(key, value);
        _logger.LogInformation("Poll with ID {Id} updated in cache.", poll.Id);
    }
    
    public async Task DeletePollAsync(Guid pollId)
    {
        var key = $"poll:{pollId}";
    
        if (!await _cache.KeyExistsAsync(key))
        {
            _logger.LogWarning("Poll with ID {Id} does not exist in cache.", pollId);
            return;
        }
    
        await _cache.KeyDeleteAsync(key);
        _logger.LogInformation("Poll with ID {Id} deleted from cache.", pollId);
    }
    
    public async Task AddVoteAsync(Vote vote)
    {
        var key = $"vote:{vote.PollId}:{vote.UserId}";
        
        var cachedVote = _mapper.Map<CachedVote>(vote);
        
        var value = JsonConvert.SerializeObject(cachedVote);
        await _cache.StringSetAsync(key, value);
        _logger.LogInformation("Vote for Poll {PollId} by User {UserId} saved to cache.", vote.PollId, vote.UserId);
    }

    public async Task<Vote?> GetVoteAsync(Guid pollId, Guid userId)
    {
        var key = $"vote:{pollId}:{userId}";
        var value = await _cache.StringGetAsync(key);
        
        if (string.IsNullOrEmpty(value))
        {
            _logger.LogWarning("Vote for Poll {PollId} by User {UserId} not found in cache.", pollId, userId);
            return null;
        }

        var cachedVote = JsonConvert.DeserializeObject<CachedVote>(value);
        
        _logger.LogInformation("Vote for Poll {PollId} by User {UserId} retrieved from cache.", pollId, userId);

        var vote = _mapper.Map<Vote>(value);
        
        return vote;
    }

    
    public async Task UpdateVoteAsync(Vote vote)
    {
        var key = $"vote:{vote.PollId}:{vote.UserId}";
    
        if (!await _cache.KeyExistsAsync(key))
        {
            _logger.LogWarning("Vote for Poll {PollId} by User {UserId} does not exist in cache.", vote.PollId, vote.UserId);
            return;
        }
    
        var cachedVote = _mapper.Map<CachedVote>(vote);
        var value = JsonConvert.SerializeObject(cachedVote);
    
        await _cache.StringSetAsync(key, value);
        _logger.LogInformation("Vote for Poll {PollId} by User {UserId} updated in cache.", vote.PollId, vote.UserId);
    }

    public async Task DeleteVoteAsync(Guid pollId, Guid userId)
    {
        var key = $"vote:{pollId}:{userId}";

        if (!await _cache.KeyExistsAsync(key))
        {
            _logger.LogWarning("Vote for Poll {PollId} by User {UserId} does not exist in cache.", pollId, userId);
            return;
        }

        await _cache.KeyDeleteAsync(key);
        _logger.LogInformation("Vote for Poll {PollId} by User {UserId} deleted from cache.", pollId, userId);
    }
}