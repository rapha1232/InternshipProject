using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBackend.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using InternshipBackend.CustomActionFilters;
using InternshipBackend.Models.Domain;
using AutoMapper;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IEmailSender _emailSender;
        private readonly IMapper _mapper;
        public UserController(UserManager<ApplicationUser> userManager, IEmailSender emailSender, IMapper mapper)
        {
            _userManager = userManager;
            _emailSender = emailSender;
            _mapper = mapper;
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
            var appUser = await _userManager.FindByIdAsync(id.ToString());
            if (appUser != null)
            {
                return Ok(_mapper.Map<ApplicationUserDto>(appUser));
            }
            return BadRequest("User not found!");
        }

        [HttpPut]
        [Route("update/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> UpdateUser([FromRoute] Guid id, [FromBody] UpdateUserRequestDto updateUserRequestDto)
        {
            var appUser = await _userManager.FindByIdAsync(id.ToString());

            if (appUser != null)
            {
                appUser.UserName = updateUserRequestDto.UserName;
                appUser.Email = updateUserRequestDto.Email;

                await _userManager.UpdateAsync(appUser);

                return Ok(new { message = "User was updated successfully!", user = _mapper.Map<ApplicationUserDto>(appUser) });
            }
            return BadRequest(new { message = "User was not updated! Something went wrong!!" });
        }

        [HttpDelete]
        [Route("delete/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> DeleteUser([FromRoute] Guid id)
        {
            var appUser = await _userManager.FindByIdAsync(id.ToString());

            if (appUser != null)
            {
                await _userManager.DeleteAsync(appUser);
                return Ok(new { message = "User was deleted successfully!" });
            }
            return BadRequest("User was not deleted! Something went wrong!!");
        }

        [HttpPut]
        [Route("manage-activation/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> ActivateDeactivateUser([FromRoute] Guid id, [FromBody] ActivateDeactivateUserRequestDto activateDeactivateUserRequestDto)
        {
            var appUser = await _userManager.FindByIdAsync(id.ToString());

            if (appUser != null)
            {
                appUser.LockoutEnabled = activateDeactivateUserRequestDto.LockoutEnabled;
                appUser.LockoutEnd = activateDeactivateUserRequestDto.LockoutEnd;

                await _userManager.UpdateAsync(appUser);
                return Ok(new { message = "User was activated/deactivated successfully!" });
            }
            return BadRequest(new { message = "User was not activated/deactivated! Something went wrong!!" });
        }

        [HttpPut]
        [Route("change-password/{id:Guid}")]
        [ValidateModel]
        public async Task<IActionResult> ChangePassword([FromRoute] Guid id, [FromBody] ChangePasswordRequestDto changePasswordRequestDto)
        {
            var appUser = await _userManager.FindByIdAsync(id.ToString());

            if (changePasswordRequestDto.NewPassword != changePasswordRequestDto.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match!" });
            }

            if (appUser != null)
            {
                var res = await _userManager.ChangePasswordAsync(appUser, changePasswordRequestDto.OldPassword, changePasswordRequestDto.NewPassword);

                if (res.Succeeded)
                {
                    return Ok(new { message = "Password was changed successfully!" });
                }
            }
            return BadRequest(new { message = "Password was not changed! Something went wrong!!" });
        }

        // Reset Password: User has forgotten their password and needs a reset token
        [HttpPut]
        [Route("reset-password")]
        [ValidateModel]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequestDto resetPasswordRequestDto)
        {
            var appUser = await _userManager.FindByEmailAsync(resetPasswordRequestDto.Email);

            if (resetPasswordRequestDto.NewPassword != resetPasswordRequestDto.ConfirmPassword)
            {
                return BadRequest(new { message = "Passwords do not match!" });
            }

            if (appUser != null)
            {
                var res = await _userManager.ResetPasswordAsync(appUser, resetPasswordRequestDto.Token, resetPasswordRequestDto.NewPassword);

                if (res.Succeeded)
                {
                    return Ok(new { message = "Password was reset successfully!" });
                }
                else
                {
                    return BadRequest(res.Errors);
                }
            }
            return BadRequest(new { message = "Password was not reset! Something went wrong!!" });
        }

        // Generate and send reset token
        [HttpPost]
        [Route("generate-reset-token")]
        [AllowAnonymous]
        [ValidateModel]
        public async Task<IActionResult> GenerateResetToken([FromBody] GenerateResetTokenRequestDto generateResetTokenRequestDto)
        {
            var appUser = await _userManager.FindByEmailAsync(generateResetTokenRequestDto.Email);
            if (appUser == null)
            {
                return BadRequest("User not found!");
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(appUser);
            var resetLink = Url.Action("ResetPassword", "User", new { token, email = generateResetTokenRequestDto.Email }, Request.Scheme);

            var message = $"Please reset your password using the following link: {resetLink}";

            await _emailSender.SendEmailAsync(generateResetTokenRequestDto.Email, "Password Reset Token", message);

            return Ok(token);
        }
    }
}