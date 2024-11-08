using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos;

public class LoginResponseDto
{
    [DataType(DataType.Text)]
    public required string JwtToken { get; set; }

    // [DataType(DataType.Text)]
    // public required string RefreshToken { get; set; }
}
