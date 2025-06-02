using Application.Repositories;
using Infrastructure.AI;
using Infrastructure.Database.Repositories;
using Infrastructure.Email;
using Infrastructure.Vector;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Qdrant.Client;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<SmtpSettings>()
            .BindConfiguration("Smtp")
            .ValidateDataAnnotations()
            .Validate(settings => 
            {
                // Validate SMTP settings (Port and Host)
                if (settings.Port <= 0 || settings.Port > 65535)
                    return false;
                return !string.IsNullOrWhiteSpace(settings.Host);
            }, "Invalid SMTP configuration");

        services.AddScoped<IPollOptionRepository, PollOptionRepository>();
        services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
        services.AddScoped<IVoteRepository, VoteRepository>();
        services.AddScoped<IPollRepository, PollRepository>();
        
        services.Configure<QDrantSettings>(configuration.GetSection("QDrantSettings"));
        services.Configure<OllamaSettings>(configuration.GetSection("OllamaSettings"));
        services.AddScoped<OllamaClient>();
        
        services.AddSingleton<QdrantClient>(sp =>
        {
            var options = sp.GetRequiredService<IOptions<QDrantSettings>>().Value;

            if (string.IsNullOrWhiteSpace(options.Host))
                throw new Exception("QDrantSettings.Host is not configured.");

            return new QdrantClient(
                host: options.Host,
                port: options.Port,
                https: false,
                apiKey: null,
                grpcTimeout: TimeSpan.FromSeconds(30),
                loggerFactory: sp.GetRequiredService<ILoggerFactory>());
        });
        
        services.AddScoped<VectorService>();
        
        return services;
    }
}