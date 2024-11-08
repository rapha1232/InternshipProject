using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos;

public class LoginRequestDto
{
    [DataType(DataType.Text)]
    public string? UserName { get; set; }

    [DataType(DataType.EmailAddress)]
    public string? Email { get; set; }

    [Required(ErrorMessage = "Email is required")]
    [DataType(DataType.Password)]
    public required string Password { get; set; }
}