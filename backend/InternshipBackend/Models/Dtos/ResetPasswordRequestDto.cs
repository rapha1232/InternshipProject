using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBacked.Models.DTOs
{
    public class ResetPasswordRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        [DataType(DataType.Password)]
        public required string NewPassword { get; set; }

        [Required(ErrorMessage = "Confirm Password is required")]
        [DataType(DataType.Password)]
        public required string ConfirmPassword { get; set; }

        [Required(ErrorMessage = "Reset Token is required")]
        [DataType(DataType.Text)]
        public required string Token { get; set; }

    }
}