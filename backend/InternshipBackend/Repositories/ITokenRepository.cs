using System;
using System.Security.Claims;
using InternshipBacked.Models.Dtos;
using InternshipBackend.Models.Domain;
using Microsoft.AspNetCore.Identity;

namespace InternshipBacked.Repositories;

public interface ITokenRepository
{
    public string CreateJWTToken(ApplicationUser user, List<string> roles);
    // public string GenerateRefreshToken();

    // public ClaimsPrincipal GetPrincipalFromExpiredToken(string token);
}
