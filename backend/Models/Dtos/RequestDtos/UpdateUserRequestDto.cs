using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos
{
    public class UpdateUserRequestDto
    {
        [Required(ErrorMessage = "UserName is required")]
        public required string UserName { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Email is not valid")]
        public required string Email { get; set; }
    }
}