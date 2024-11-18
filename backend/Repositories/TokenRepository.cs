using System.IdentityModel.Tokens.Jwt;
using System.Reflection.Metadata.Ecma335;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBackend.Models.Dtos.RequestDtos;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace InternshipBacked.Repositories;

public class TokenRepository : ITokenRepository
{
    private readonly IConfiguration _configuration;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IMapper _mapper;

    public TokenRepository(IConfiguration configuration, UserManager<ApplicationUser> userManager, IMapper mapper)
    {
        _configuration = configuration;
        _userManager = userManager;
        _mapper = mapper;
    }
    public string CreateJWTToken(ApplicationUser user, List<string> roles)
    {
#pragma warning disable CS8604 // Possible null reference argument.
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email)
        };
#pragma warning restore CS8604 // Possible null reference argument.

        foreach (var role in roles)
        {
            claims.Add(new Claim(ClaimTypes.Role, role));
        }

#pragma warning disable CS8604 // Possible null reference argument.
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
#pragma warning restore CS8604 // Possible null reference argument.

        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var accessToken = new JwtSecurityToken(
            _configuration["Jwt:Issuer"],
            _configuration["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(accessToken);
    }

    public string CreateRefreshToken()
    {
        var randomNumber = new byte[64];
        using (var nubGenerator = RandomNumberGenerator.Create())
        {
            nubGenerator.GetBytes(randomNumber);
        }
        return Convert.ToBase64String(randomNumber);
    }

    public async Task<Tuple<string, LoginResponseDto>> RefreshToken(RefreshTokenRequestDto refreshTokenRequestDto)
    {
        var res = new LoginResponseDto();

        var principal = GetTokenPrincipal(refreshTokenRequestDto.JwtToken);
        if (principal == null) return Tuple.Create("Null Principal", res);

        var email = principal.FindFirstValue(ClaimTypes.Email);
        if (email == null) return Tuple.Create("Null Email", res);

        var appUser = await _userManager.Users.Include(u => u.Wishlist).Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Email == email);
        if (appUser == null) return Tuple.Create("Null User " + email, res);
        if (appUser.RefreshToken != refreshTokenRequestDto.RefreshToken ||
            appUser.RefreshTokenExpiry < DateTime.Now) return Tuple.Create("Refresh token desync " + appUser.RefreshToken + " " + appUser.RefreshTokenExpiry, res);

        var appUserDto = _mapper.Map<ApplicationUserDto>(appUser);

        var jwtToken = CreateJWTToken(appUser, _userManager.GetRolesAsync(appUser).Result.ToList());
        var refreshToken = CreateRefreshToken();

        appUser.RefreshToken = refreshToken;
        appUser.RefreshTokenExpiry = DateTime.Now.AddDays(7);

        await _userManager.UpdateAsync(appUser);

        res = new LoginResponseDto
        {
            User = appUserDto,
            JwtToken = jwtToken,
            RefreshToken = refreshToken,
            isLoggedIn = true,
        };

        return Tuple.Create("success", res);
    }

    private ClaimsPrincipal? GetTokenPrincipal(string jwtToken)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var validation = new TokenValidationParameters
        {
            IssuerSigningKey = securityKey,
            ValidateLifetime = false,
            ValidateActor = false,
            ValidateIssuer = false,
            ValidateAudience = false
        };

        return new JwtSecurityTokenHandler().ValidateToken(jwtToken, validation, out _);
    }
}
