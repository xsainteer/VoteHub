using Domain.DTOs;
using Domain.Interfaces;

namespace Application.Services;

public class UserService : IUserService
{
    private readonly Domain.Interfaces.IUserManager _userManager;

    public UserService(Domain.Interfaces.IUserManager userManager)
    {
        _userManager = userManager;
    }

    public async Task<bool> CreateAsync(RegisterUserDto userDto)
    {
        var result = await _userManager.CreateUserAsync(userDto);

        return result;
    }
}