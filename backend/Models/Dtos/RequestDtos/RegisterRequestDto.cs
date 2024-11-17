using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBacked.Models.DTOs;

public class RegisterRequestDto
{
    [Required(ErrorMessage = "Username is required")]
    [DataType(DataType.Text)]
    public required string UserName { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [DataType(DataType.EmailAddress, ErrorMessage = "Email is not valid")]
    public required string Email { get; set; }

    [Required(ErrorMessage = "Password is required")]
    [DataType(DataType.Password)]
    public required string Password { get; set; }

    [Required(ErrorMessage = "Roles are required")]
    public required string[] Roles { get; set; }
}
