using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBacked.Repositories;
using InternshipBackend.Models.Dtos;
using InternshipBackend.CustomActionFilters;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
        public AuthController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository)
        {
            this._userManager = userManager;
            this._tokenRepository = tokenRepository;
        }

        [HttpPost]
        [Route("register")]
        [ValidateModel]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
        {
            var identityUser = new IdentityUser()
            {
                UserName = registerRequestDto.UserName,
                Email = registerRequestDto.Email,
            };
            var res = await _userManager.CreateAsync(identityUser, registerRequestDto.Password);

            if (res.Errors.Any())
            {
                return BadRequest(res.Errors);
            }

            if (res.Succeeded)
            {
                // Add Roles
                if (registerRequestDto.Roles != null && registerRequestDto.Roles.Any())
                {
                    res = await _userManager.AddToRolesAsync(identityUser, registerRequestDto.Roles);

                    if (res.Succeeded)
                    {
                        return Ok("User was registered! Please Login!!");
                    }
                }
            }
            return BadRequest("User was not registered! Something went wrong!!");
        }

        [HttpPost]
        [Route("login")]
        [ValidateModel]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var identityUser = await _userManager.FindByEmailAsync(loginRequestDto.UserNameOrEmail);
            if (identityUser == null)
            {
                identityUser = await _userManager.FindByNameAsync(loginRequestDto.UserNameOrEmail);
            }
            if (identityUser != null)
            {
                var passValid = await _userManager.CheckPasswordAsync(identityUser, loginRequestDto.Password);

                if (!passValid)
                {
                    return Unauthorized("User was not logged in! Password is invalid!!");
                }

                if (identityUser.LockoutEnd > DateTimeOffset.Now)
                {
                    return Unauthorized("User was not logged in! Account is locked!!");
                }

                var roles = await _userManager.GetRolesAsync(identityUser);

                if (roles != null)
                {
                    var jwt = _tokenRepository.CreateJWTToken(identityUser, roles.ToList());
                    // var refreshToken = _tokenRepository.GenerateRefreshToken();

                    var response = new LoginResponseDto()
                    {
                        JwtToken = jwt,
                        // RefreshToken = refreshToken
                    };

                    return Ok(response);
                }
            }
            return BadRequest("User was not logged in! Something went wrong!!");
        }

        // [HttpPost]
        // [Route("refresh-token")]
        // [ValidateModel]
        // public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequestDto)
        // {
        //     var principal = _tokenRepository.GetPrincipalFromExpiredToken(refreshTokenRequestDto.Token);
        //     var username = principal.Identity.Name;
        //     var user = await _userManager.FindByNameAsync(username);
        //     var roles = await _userManager.GetRolesAsync(user);

        //     if (user == null || refreshTokenRequestDto.RefreshToken != _tokenRepository.GetRefreshToken(user))
        //     {
        //         return BadRequest("Invalid refresh token!");
        //     }

        //     var jwt = _tokenRepository.CreateJWTToken(user, roles.ToList());
        //     var newRefreshToken = _tokenRepository.GenerateRefreshToken();

        //     var response = new LoginResponseDto()
        //     {
        //         JwtToken = jwt,
        //         RefreshToken = newRefreshToken
        //     };

        //     return Ok(response);
        // }
    }
}
