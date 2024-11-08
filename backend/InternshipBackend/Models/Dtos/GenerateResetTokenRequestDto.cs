using System.ComponentModel.DataAnnotations;

namespace InternshipBackend.Models.Dtos
{
    public class GenerateResetTokenRequestDto
    {
        [Required(ErrorMessage = "Email is required")]
        [DataType(DataType.EmailAddress)]
        public required string Email { get; set; }
    }
}
