using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBackend.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using InternshipBackend.CustomActionFilters;
using InternshipBacked.Data;
using InternshipBackend.Models.Domain;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly BookDBContext _context;
        public UserController(UserManager<ApplicationUser> userManager, IEmailSender emailSender, BookDBContext context)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> GetOneUser([FromRoute] Guid id)
        {
            var identityUser = await _userManager.FindByIdAsync(id.ToString());
            if (identityUser != null)
            {
                return Ok(identityUser);
            }
            return BadRequest("User not found!");
        }

        [HttpPut]
        [Route("update/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, [FromBody] UpdateUserRequestDto updateUserRequestDto)
        {
            var identityUser = await _userManager.FindByIdAsync(id.ToString());

            if (identityUser != null)
            {
                identityUser.UserName = updateUserRequestDto.UserName;
                identityUser.Email = updateUserRequestDto.Email;

                await _userManager.UpdateAsync(identityUser);
                return Ok("User was updated successfully!");
            }
            return BadRequest("User was not updated! Something went wrong!!");
        }

        [HttpDelete]
        [Route("delete/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
        {
            var identityUser = await _userManager.FindByIdAsync(id.ToString());

            if (identityUser != null)
            {
                await _userManager.DeleteAsync(identityUser);
                return Ok("User was deleted successfully!");
            }
            return BadRequest("User was not deleted! Something went wrong!!");
        }

        [HttpPut]
        [Route("manage-activation/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> ActivateDeactivateUser([FromRoute] Guid id, [FromBody] ActivateDeactivateUserRequestDto activateDeactivateUserRequestDto)
        {
            var identityUser = await _userManager.FindByIdAsync(id.ToString());

            if (identityUser != null)
            {
                identityUser.LockoutEnabled = activateDeactivateUserRequestDto.LockoutEnabled;
                identityUser.LockoutEnd = activateDeactivateUserRequestDto.LockoutEnd;

                await _userManager.UpdateAsync(identityUser);
                return Ok("User was activated/deactivated successfully!");
            }
            return BadRequest("User was not activated/deactivated! Something went wrong!!");
        }

        [HttpPut]
        [Route("change-password/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequestDto changePasswordRequestDto)
        {
            var identityUser = await _userManager.FindByIdAsync(id.ToString());

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
        [HttpPut]
        [Route("reset-password")]
        [ValidateModel]
        [AllowAnonymous]
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
    }
}