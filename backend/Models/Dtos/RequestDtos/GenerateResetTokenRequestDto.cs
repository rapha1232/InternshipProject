using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos
{
    public class GenerateResetTokenRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress, ErrorMessage = "Email is not valid")]
        public required string Email { get; set; }
    }
}