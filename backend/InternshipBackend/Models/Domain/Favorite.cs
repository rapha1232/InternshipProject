using System;
using Microsoft.AspNetCore.Identity;

namespace InternshipBackend.Models.Domain
{
    public class Favorite
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public virtual IdentityUser User { get; set; }
        public Guid BookId { get; set; }
        public virtual Book Book { get; set; }
    }
}