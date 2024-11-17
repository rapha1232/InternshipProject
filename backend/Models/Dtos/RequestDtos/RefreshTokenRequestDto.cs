namespace InternshipBackend.Models.Dtos.RequestDtos
{
    public class RefreshTokenRequestDto
    {
        public required string RefreshToken { get; set; }
        public required string JwtToken { get; set; }
    }
}