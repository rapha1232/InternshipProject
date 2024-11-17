using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos;

public class ApplicationUserDto
{
    public Guid Id { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public List<WishlistItemWithoutUserDto> Wishlist { get; set; }
    public List<FavoriteWithoutUserDto> Favorites { get; set; }
}
