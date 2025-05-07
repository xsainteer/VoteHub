using System.ComponentModel.DataAnnotations;

namespace Domain.DTOs;

public class RegisterUserDto
{
    [Required(ErrorMessage = "User name is required")]
    public string UserName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters")]
    [RegularExpression(@"^(?=.*\d)(?=.*[\W_]).+$", ErrorMessage = "Password must contain at least one digit and one non-alphanumeric character")]
    [DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;
}