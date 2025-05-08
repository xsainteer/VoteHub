using Domain.DTOs;

namespace Domain.Interfaces;

public interface IUserManager
{
    Task<bool> RegisterUserAsync(RegisterUserDto userDto);
    Task<bool> LogInUserAsync(LogInUserDto userDto);
    Task<bool> IsEmailConfirmedAsync(string userId);
    Task<string> GenerateEmailConfirmationTokenAsync(string userId);
    Task<bool> AddToRoleAsync(string userId, string role);
}