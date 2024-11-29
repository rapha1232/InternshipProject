using System;
using System.ComponentModel.DataAnnotations;
using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class AddBookRequestDto
    {
        [Required(ErrorMessage = "Title is required")]
        [DataType(DataType.Text)]
        public required string Title { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [DataType(DataType.Text)]
        public required string Description { get; set; }

        [Required(ErrorMessage = "Summary is required")]
        [DataType(DataType.Text)]
        public required string Summary { get; set; }
        public IFormFile? BookImageFile { get; set; }
        public bool toBeShown { get; set; }

        [Required(ErrorMessage = "Author's Name is required")]
        [DataType(DataType.Text)]
        public required string AuthorName { get; set; }
    }
}