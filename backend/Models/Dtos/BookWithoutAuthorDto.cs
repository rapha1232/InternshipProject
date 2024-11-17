using System;

namespace InternshipBackend.Models.Dtos
{
    public class BookWithoutAuthorDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Summary { get; set; }
        public string? BookImageUrl { get; set; }
        public bool toBeShown { get; set; }
    }
}