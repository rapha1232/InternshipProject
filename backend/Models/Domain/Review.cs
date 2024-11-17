using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Review
    {
        public Guid Id { get; set; }  // Unique identifier for the review
        public required string UserId { get; set; }  // The user who gave the review
        public Guid BookId { get; set; }  // The book being reviewed
        public virtual Book Book { get; set; }  // The book being reviewed
        public required string Content { get; set; }  // The text of the review
        public required int Rating { get; set; }  // The rating given by the user
        public DateTime ReviewDate { get; set; }  // The date when the review was submitted
    }
}