using Application.Repositories;
using Infrastructure.Database.Repositories;
using Infrastructure.Email;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
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
        
        return services;
    }
}