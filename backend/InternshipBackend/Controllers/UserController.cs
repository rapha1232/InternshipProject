using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBacked.Repositories;
using InternshipBackend.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using InternshipBackend.CustomActionFilters;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ITokenRepository _tokenRepository;
        private readonly IEmailSender _emailSender;
        public UserController(UserManager<IdentityUser> userManager, ITokenRepository tokenRepository, IEmailSender emailSender)
        {
            this._userManager = userManager;
            this._tokenRepository = tokenRepository;
            this._emailSender = emailSender;
        }

        // Change Password: User is authenticated and knows their current password
        [HttpPost]
        [Route("change-password")]
        [ValidateModel]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequestDto changePasswordRequestDto)
        {
            var identityUser = await _userManager.FindByEmailAsync(changePasswordRequestDto.Email);

            if (changePasswordRequestDto.NewPassword != changePasswordRequestDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match!");
            }

            if (identityUser != null)
            {
                var res = await _userManager.ChangePasswordAsync(identityUser, changePasswordRequestDto.OldPassword, changePasswordRequestDto.NewPassword);

                if (res.Succeeded)
                {
                    return Ok("Password was changed successfully!");
                }
            }
            return BadRequest("Password was not changed! Something went wrong!!");
        }

        // Reset Password: User has forgotten their password and needs a reset token
        [HttpPost]
        [Route("reset-password")]
        [ValidateModel]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto resetPasswordRequestDto)
        {
            var identityUser = await _userManager.FindByEmailAsync(resetPasswordRequestDto.Email);

            if (resetPasswordRequestDto.NewPassword != resetPasswordRequestDto.ConfirmPassword)
            {
                return BadRequest("Passwords do not match!");
            }

            if (identityUser != null)
            {
                var res = await _userManager.ResetPasswordAsync(identityUser, resetPasswordRequestDto.Token, resetPasswordRequestDto.NewPassword);

                if (res.Succeeded)
                {
                    return Ok("Password was reset successfully!");
                }
                else
                {
                    return BadRequest(res.Errors);
                }
            }
            return BadRequest("Password was not reset! Something went wrong!!");
        }

        // Generate and send reset token
        [HttpPost]
        [Route("generate-reset-token")]
        [AllowAnonymous]
        [ValidateModel]
        public async Task<IActionResult> GenerateResetToken([FromBody] GenerateResetTokenRequestDto generateResetTokenRequestDto)
        {
            var identityUser = await _userManager.FindByEmailAsync(generateResetTokenRequestDto.Email);
            if (identityUser == null)
            {
                return BadRequest("User not found!");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(identityUser);
            var resetLink = Url.Action("ResetPassword", "User", new { token, email = generateResetTokenRequestDto.Email }, Request.Scheme);

            var message = $"Please reset your password using the following link: {resetLink}";

            await _emailSender.SendEmailAsync(generateResetTokenRequestDto.Email, "Password Reset Token", message);

            return Ok(token);
        }

        [HttpGet]
        [Route("get-all-users")]
        [ValidateModel]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPut]
        [Route("activate-deactivate-user")]
        [ValidateModel]
        public async Task<IActionResult> ActivateDeactivateUser([FromBody] ActivateDeactivateUserRequestDto activateDeactivateUserRequestDto)
        {
            var identityUser = await _userManager.FindByEmailAsync(activateDeactivateUserRequestDto.Email);

            if (identityUser != null)
            {
                identityUser.LockoutEnabled = activateDeactivateUserRequestDto.LockoutEnabled;
                identityUser.LockoutEnd = activateDeactivateUserRequestDto.LockoutEnd;

                await _userManager.UpdateAsync(identityUser);
                return Ok("User was activated/deactivated successfully!");
            }
            return BadRequest("User was not activated/deactivated! Something went wrong!!");
        }
    }
}