using Domain.DTOs;

namespace Domain.Interfaces;

public interface IUserManager
{
    Task<bool> CreateUserAsync(RegisterUserDto userDto);
    Task<bool> IsEmailConfirmedAsync(string userId);
    Task<string> GenerateEmailConfirmationTokenAsync(string userId);
    Task<bool> AddToRoleAsync(string userId, string role);
}