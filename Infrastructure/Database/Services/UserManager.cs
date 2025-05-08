using Domain.DTOs;
using Domain.Interfaces;
using Infrastructure.Database.Entities;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Database.Services;

public class UserManager : IUserManager
{
    private readonly UserManager<VoteHubUser> _userManager;
    private readonly SignInManager<VoteHubUser> _signInManager;

    public UserManager(UserManager<VoteHubUser> userManager, SignInManager<VoteHubUser> signInManager)
    {
        _userManager = userManager;
        _signInManager = signInManager;
    }

    public async Task<bool> RegisterUserAsync(RegisterUserDto userDto)
    {
        var user = new VoteHubUser
        {
            UserName = userDto.UserName,
            Email = userDto.Email
        };
        
        var result = await _userManager.CreateAsync(user, userDto.Password);
        return result.Succeeded;
    }
    
    public async Task<bool> LogInUserAsync(LogInUserDto userDto)
    {
        var result = await _signInManager.PasswordSignInAsync(
            userDto.UserName,
            userDto.Password,
            userDto.RememberMe,
            false);
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