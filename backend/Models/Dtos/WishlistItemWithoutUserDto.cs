using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos;
public class WishlistItemWithoutUserDto
{
    public Guid Id { get; set; }
    public required string UserId { get; set; }
    public Guid BookId { get; set; }
    public bool Read { get; set; } = false;
}