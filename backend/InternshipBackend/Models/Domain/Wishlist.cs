using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Wishlist
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public virtual IdentityUser User { get; set; }
        public Guid BookId { get; set; }
        public virtual Book Book { get; set; }
        public DateTime AddedDate { get; set; }  // The date when the book was added to the wishlist
        public bool isRead { get; set; }  // Whether the book has been read
    }
}