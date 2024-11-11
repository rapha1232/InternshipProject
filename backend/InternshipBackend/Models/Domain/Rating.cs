using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Rating
    {
        public Guid Id { get; set; }  // Unique identifier for the rating
        public Guid UserId { get; set; }  // The user who gave the rating
        public virtual required ApplicationUser User { get; set; }  // The user who wrote the rating
        public Guid BookId { get; set; }  // The book that was rated
        public virtual required Book Book { get; set; }  // The book being rated
        public int RatingValue { get; set; }  // The rating value (e.g., 1-5)
        public DateTime RatingDate { get; set; }  // Date when the rating was given
    }
}
