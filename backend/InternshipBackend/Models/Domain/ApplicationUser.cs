using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace InternshipBackend.Models.Domain
{
    public class ApplicationUser : IdentityUser
    {
        public virtual ICollection<WishlistItem> Wishlist { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
    }
}
