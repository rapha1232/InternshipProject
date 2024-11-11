using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class WishlistItemDto
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public virtual required ApplicationUser User { get; set; }
        public Guid BookId { get; set; }
        public bool Read { get; set; }
    }
}