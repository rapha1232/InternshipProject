using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Favorite
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public virtual required ApplicationUser User { get; set; }
        public Guid BookId { get; set; }
    }
}