using Domain.DTOs;
using Domain.Interfaces;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Database.Services;

public class UserManager : IUserManager
{
    private readonly UserManager<VoteHubUser> _userManager;

    public UserManager(UserManager<VoteHubUser> userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> CreateUserAsync(RegisterUserDto userDto)
    {
        var user = new VoteHubUser
        {
            UserName = userDto.UserName,
            Email = userDto.Email
        };
        
        var result = await _userManager.CreateAsync(user, userDto.Password);
        return result.Succeeded;
    }

    public Task<bool> IsEmailConfirmedAsync(string userId)
    {
        throw new NotImplementedException();
    }

    public Task<string> GenerateEmailConfirmationTokenAsync(string userId)
    {
        throw new NotImplementedException();
    }

    public Task<bool> AddToRoleAsync(string userId, string role)
    {
        throw new NotImplementedException();
    }
}