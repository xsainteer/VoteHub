using Application.Interfaces;
using Application.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IPollOptionService, PollOptionService>();
        services.AddScoped(typeof(IGenericService<>), typeof(GenericService<>));
        services.AddScoped<IPollService, PollService>();
        services.AddScoped<IVoteService, VoteService>();
        services.AddScoped<IStatisticsService, StatisticsService>();
        
        return services;
    }
}