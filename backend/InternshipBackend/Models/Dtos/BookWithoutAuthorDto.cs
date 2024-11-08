using System;

namespace InternshipBackend.Models.Dtos
{
    public class BookWithoutAuthorDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string? BookImageUrl { get; set; }
        public bool toBeShown { get; set; }
    }
}