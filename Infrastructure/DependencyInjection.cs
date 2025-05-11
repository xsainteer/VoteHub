using Domain.Interfaces;
using Infrastructure.Database;
using Infrastructure.Database.Services;
using Infrastructure.Email;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserManager, UserManager>();
        
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
        
        return services;
    }
}