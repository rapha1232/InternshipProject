using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos;

public class LoginRequestDto
{
    [Required(ErrorMessage = "Username or Email is required")]
    [DataType(DataType.Text)]
    public required string UserNameOrEmail { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [DataType(DataType.Password)]
    public required string Password { get; set; }
}