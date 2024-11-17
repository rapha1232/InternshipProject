using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBacked.Repositories;
using InternshipBackend.Models.Dtos;
using InternshipBackend.CustomActionFilters;
using InternshipBackend.Models.Domain;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using InternshipBacked.Mappings;
using InternshipBackend.Models.Dtos.RequestDtos;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
        private readonly IMapper _mapper;
        public AuthController(UserManager<ApplicationUser> userManager, ITokenRepository tokenRepository, IMapper mapper)
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
            _mapper = mapper;
        }

        [HttpPost]
        [Route("register")]
        [ValidateModel]
        public async Task<IActionResult> Register([FromBody] RegisterRequestDto registerRequestDto)
        {
            var appUser = new ApplicationUser()
            {
                UserName = registerRequestDto.UserName,
                Email = registerRequestDto.Email,
            };
            var res = await _userManager.CreateAsync(appUser, registerRequestDto.Password);

            if (res.Errors.Any())
            {
                return BadRequest(new { message = res.Errors });
            }

            if (res.Succeeded)
            {
                // Add Roles
                if (registerRequestDto.Roles != null && registerRequestDto.Roles.Any())
                {
                    res = await _userManager.AddToRolesAsync(appUser, registerRequestDto.Roles);

                    if (res.Succeeded)
                    {
                        return Ok(new { message = "User was registered! Please Login!!" });
                    }
                }
            }
            return BadRequest(new { message = "User was not registered! Something went wrong!!" });
        }

        [HttpPost]
        [Route("login")]
        [ValidateModel]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto loginRequestDto)
        {
            var appUser = await _userManager.Users.Include(u => u.Wishlist).Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Email == loginRequestDto.UserNameOrEmail);
            if (appUser == null)
            {
                appUser = await _userManager.Users.Include(u => u.Wishlist).Include(u => u.Favorites).FirstOrDefaultAsync(u => u.UserName == loginRequestDto.UserNameOrEmail);
            }
            if (appUser != null)
            {
                var passValid = await _userManager.CheckPasswordAsync(appUser, loginRequestDto.Password);

                if (!passValid)
                {
                    return Unauthorized(new { message = "User was not logged in! Password is invalid!!" });
                }

                if (appUser.LockoutEnd > DateTimeOffset.Now)
                {
                    return Unauthorized(new { message = "User was not logged in! Account is locked!!" });
                }

                var roles = await _userManager.GetRolesAsync(appUser);

                if (roles != null)
                {
                    var jwt = _tokenRepository.CreateJWTToken(appUser, roles.ToList());
                    var refreshToken = _tokenRepository.CreateRefreshToken();

                    var response = new LoginResponseDto()
                    {
                        JwtToken = jwt,
                        RefreshToken = refreshToken,
                        User = _mapper.Map<ApplicationUserDto>(appUser),
                        isLoggedIn = true,
                    };

                    appUser.RefreshToken = refreshToken;
                    appUser.RefreshTokenExpiry = DateTime.Now.AddDays(7);
                    await _userManager.UpdateAsync(appUser);

                    HttpContext.Session.SetString("UserId", appUser.Id);

                    return Ok(new { message = "success", response });
                }
            }
            return BadRequest(new { message = "User was not logged in! Something went wrong!!" });
        }

        [HttpPost("refreshToken")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequestDto refreshTokenRequestDto)
        {
            var loginResult = await _tokenRepository.RefreshToken(refreshTokenRequestDto);
            if (loginResult.Item2.isLoggedIn)
            {
                return Ok(new { message = loginResult.Item1, result = loginResult.Item2 });
            }
            return Unauthorized(new { message = loginResult.Item1 });
        }
    }
}
