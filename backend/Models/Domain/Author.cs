using System;

namespace InternshipBackend.Models.Domain;

public class Author
{
    public Guid Id { get; set; }
    public required string Name { get; set; }
    public string? Biography { get; set; }
    public string? AuthorImageUrl { get; set; }

    // Navigation property to represent one-to-many relationship with Book
    public virtual required List<Book> Books { get; set; }
}
