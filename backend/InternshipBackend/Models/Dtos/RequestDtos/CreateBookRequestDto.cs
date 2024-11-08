using System;

namespace InternshipBackend.Models.Dtos
{
    public class CreateBookRequestDto
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string? BookImageUrl { get; set; }
    }
}