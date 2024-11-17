using System;
using System.ComponentModel.DataAnnotations;

namespace InternshipBacked.Models.DTOs;

public class ChangePasswordRequestDto
{
    [Required(ErrorMessage = "OldPassword is required")]
    [DataType(DataType.Password)]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    [MaxLength(100, ErrorMessage = "Password must be at most 100 characters long")]
    public required string OldPassword { get; set; }

    [Required(ErrorMessage = "NewPassword is required")]
    [DataType(DataType.Password)]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    [MaxLength(100, ErrorMessage = "Password must be at most 100 characters long")]
    public required string NewPassword { get; set; }

    [Required(ErrorMessage = "Password confirmation is required")]
    [DataType(DataType.Password)]
    [MinLength(6, ErrorMessage = "Password must be at least 6 characters long")]
    [MaxLength(100, ErrorMessage = "Password must be at most 100 characters long")]
    public required string ConfirmPassword { get; set; }
}