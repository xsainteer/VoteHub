using Microsoft.EntityFrameworkCore.Storage;

namespace Infrastructure.Cache;

using Application.Interfaces;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;

public class RedisService : ICacheService
{
    private readonly ILogger<RedisService> _logger;
    private readonly IDatabase _cache;

    public RedisService(IConnectionMultiplexer connectionMultiplexer, ILogger<RedisService> logger)
    {
        _cache = connectionMultiplexer.GetDatabase();
        _logger = logger;
    }

    
}