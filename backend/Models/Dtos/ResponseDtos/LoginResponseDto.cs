using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos;

public class LoginResponseDto
{
    [DataType(DataType.Text)]
    public string JwtToken { get; set; }

    public ApplicationUserDto User { get; set; }

    [DataType(DataType.Text)]
    public string RefreshToken { get; set; }

    public bool isLoggedIn { get; set; } = false;
}
