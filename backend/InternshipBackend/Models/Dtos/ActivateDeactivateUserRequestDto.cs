using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBacked.Models.DTOs
{
    public class ActivateDeactivateUserRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }

        [Required(ErrorMessage = "Lockout setting is required")]
        [DataType(DataType.Text)]
        public bool LockoutEnabled { get; set; }

        [Required(ErrorMessage = "Lockout end date is required")]
        [DataType(DataType.DateTime)]
        public DateTimeOffset? LockoutEnd { get; set; } = DateTimeOffset.Now.AddYears(1);
    }
}