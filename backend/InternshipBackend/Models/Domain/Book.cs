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

    // Foreign key to link to Author
    public Guid AuthorId { get; set; }

    // Navigation property to reference the Author of the Book
    public Author Author { get; set; }

    // Navigation property to Wishlist
    public virtual ICollection<Wishlist> Wishlist { get; set; }  // The list of users who have added this book to their wishlist
    public virtual ICollection<Review> Review { get; set; }  // The list of reviews for the book
    public virtual ICollection<Rating> Rating { get; set; }  // The list of ratings for the book
}
