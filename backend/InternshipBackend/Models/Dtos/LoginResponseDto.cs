using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos;

public class LoginResponseDto
{

    [Required(ErrorMessage = "JWT Token is required")]
    [DataType(DataType.Text)]
    public required string JwtToken { get; set; }
}
