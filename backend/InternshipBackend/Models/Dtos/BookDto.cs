using System;

namespace InternshipBackend.Models.Dtos
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public required string Title { get; set; }
        public required string Description { get; set; }
        public required string Summary { get; set; }
        public string? BookImageUrl { get; set; }
        public bool toBeShown { get; set; }
        public Guid AuthorId { get; set; }

        public virtual required AuthorWithoutBooksDto Author { get; set; }
    }
}