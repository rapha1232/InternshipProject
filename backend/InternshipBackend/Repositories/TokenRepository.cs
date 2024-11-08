using System;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using InternshipBacked.Models.Dtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace InternshipBacked.Repositories;

public class TokenRepository : ITokenRepository
{
    private readonly IConfiguration configuration;

    public TokenRepository(IConfiguration configuration)
    {
        this.configuration = configuration;
    }
    public string CreateJWTToken(IdentityUser user, List<string> roles)
    {
        var claims = new List<Claim>();
        claims.Add(new Claim(ClaimTypes.Email, user.Email));

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            configuration["Jwt:Issuer"],
            configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddHours(24),
            signingCredentials: credentials);


        // var refreshToken = GenerateRefreshToken();
        // refreshToken

        return new JwtSecurityTokenHandler().WriteToken(accessToken);
    }

    // public string GenerateRefreshToken()
    // {
    //     var randomNumber = new byte[32];
    //     using (var rng = RandomNumberGenerator.Create())
    //     {
    //         rng.GetBytes(randomNumber);
    //         return Convert.ToBase64String(randomNumber);
    //     }
    // }

    // public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
    // {
    //     var jwtSettings = configuration.GetSection("Jwt");
    //     var tokenValidationParameters = new TokenValidationParameters
    //     {
    //         ValidateAudience = true,
    //         ValidAudience = jwtSettings["Audience"],
    //         ValidateIssuer = true,
    //         ValidIssuer = jwtSettings["Issuer"],
    //         ValidateIssuerSigningKey = true,
    //         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"])),
    //         ValidateLifetime = true
    //     };

    //     var tokenHandler = new JwtSecurityTokenHandler();

    //     SecurityToken securityToken;

    //     var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out securityToken);

    //     var jwtSecurityToken = securityToken as JwtSecurityToken;

    //     if (jwtSecurityToken == null || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
    //     {
    //         throw new SecurityTokenException("Invalid token");
    //     }

    //     return principal;
    // }
}
