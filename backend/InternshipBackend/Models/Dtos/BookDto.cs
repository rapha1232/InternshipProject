using System;

namespace InternshipBackend.Models.Dtos
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Summary { get; set; }
        public string? BookImageUrl { get; set; }
        public bool toBeShown { get; set; }
        public Guid AuthorId { get; set; }

        public AuthorWithoutBooksDto Author { get; set; }
    }
}