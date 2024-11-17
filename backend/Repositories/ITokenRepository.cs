using System;
using System.Security.Claims;
using InternshipBacked.Models.Dtos;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBackend.Models.Dtos.RequestDtos;
using Microsoft.AspNetCore.Identity;

namespace InternshipBacked.Repositories;

public interface ITokenRepository
{
    public string CreateJWTToken(ApplicationUser user, List<string> roles);
    public string CreateRefreshToken();
    public Task<Tuple<string, LoginResponseDto>> RefreshToken(RefreshTokenRequestDto refreshTokenRequestDto);
}
