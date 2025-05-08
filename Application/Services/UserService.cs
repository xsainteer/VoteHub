using Domain.DTOs;
using Domain.Interfaces;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly IUserManager _userManager;

    public UserService(IUserManager userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> CreateAsync(RegisterUserDto userDto)
    {
        var result = await _userManager.RegisterUserAsync(userDto);

        return result;
    }
    
    public async Task<bool> LogInAsync(LogInUserDto userDto)
    {
        var result = await _userManager.LogInUserAsync(userDto);

        return result;
    }
}