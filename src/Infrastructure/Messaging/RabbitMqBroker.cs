using Infrastructure.Vector;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using RabbitMQ.Client;

namespace Infrastructure.Messaging;

public class RabbitMqBroker
{
    private readonly IConnection _connection;
    private readonly ILogger<RabbitMqBroker> _logger;
    private readonly QDrantSettings _qDrantSettings;

    public RabbitMqBroker(IConnectionFactory connectionFactory, ILogger<RabbitMqBroker> logger, IOptions<QDrantSettings> qDrantSettings)
    {
        _connection = connectionFactory.CreateConnection();
        _logger = logger;
        _qDrantSettings = qDrantSettings.Value;
    }
}