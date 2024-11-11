using System;

namespace InternshipBackend.Models.Domain;

public class Book
{
    public Guid Id { get; set; }
    public required string Title { get; set; }
    public required string Description { get; set; }
    public required string Summary { get; set; }
    public string? BookImageUrl { get; set; }
    public bool toBeShown { get; set; }

    // Foreign key to link to Author
    public Guid AuthorId { get; set; }

    // Navigation property to reference the Author of the Book
    public virtual required Author Author { get; set; }
}
