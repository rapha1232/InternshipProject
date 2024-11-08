using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBacked.Models.DTOs
{
    public class ActivateDeactivateUserRequestDto
    {
        [Required(ErrorMessage = "Lockout setting is required")]
        [DataType(DataType.Text, ErrorMessage = "Lockout setting is not valid")]
        public bool LockoutEnabled { get; set; }

        [DataType(DataType.DateTime)]
        public DateTimeOffset? LockoutEnd { get; set; } = DateTimeOffset.Now.AddYears(1);
    }
}