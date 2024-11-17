using Microsoft.AspNetCore.Identity;
using System.Collections.Generic;

namespace InternshipBackend.Models.Domain
{
    public class ApplicationUser : IdentityUser
    {

        public string? RefreshToken { get; set; }
        public DateTime RefreshTokenExpiry { get; set; }
        public virtual ICollection<WishlistItem> Wishlist { get; set; }
        public virtual ICollection<Favorite> Favorites { get; set; }
    }
}
