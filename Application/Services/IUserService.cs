using Domain.DTOs;

namespace Application.Services;

public interface IUserService
{
    public Task<bool> CreateAsync(RegisterUserDto userDto);
}