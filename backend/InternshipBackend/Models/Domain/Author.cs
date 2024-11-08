using System;

namespace InternshipBackend.Models.Domain;

public class Author
{
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string? Biography { get; set; }
    public string? AuthorImageUrl { get; set; }
    public List<Book> Books { get; set; }

    public bool toBeShown { get; set; }
}
