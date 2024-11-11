using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Review
    {
        public Guid Id { get; set; }  // Unique identifier for the review
        public Guid UserId { get; set; }  // The user who gave the review
        public virtual required ApplicationUser User { get; set; }  // The user who wrote the review
        public Guid BookId { get; set; }  // The book being reviewed
        public virtual required Book Book { get; set; }  // The book that is being reviewed
        public required string Content { get; set; }  // The text of the review
        public DateTime ReviewDate { get; set; }  // The date when the review was submitted
    }
}