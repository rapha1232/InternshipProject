using System;

namespace InternshipBackend.Models.Domain;

public class Book
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Summary { get; set; }
    public string? BookImageUrl { get; set; }
    public bool toBeShown { get; set; }
    public Guid AuthorId { get; set; }

    public Author Author { get; set; }
}
