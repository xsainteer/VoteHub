using Domain.Interfaces;
using Infrastructure.Database.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        services.AddScoped<IUserManager, UserManager>();
        
        return services;
    }
}