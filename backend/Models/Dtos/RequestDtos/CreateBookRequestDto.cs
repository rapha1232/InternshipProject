using System;

namespace InternshipBackend.Models.Dtos
{
    public class CreateBookRequestDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Summary { get; set; }
        public IFormFile? BookImage { get; set; }
        public required Guid AuthorId { get; set; }
    }
}