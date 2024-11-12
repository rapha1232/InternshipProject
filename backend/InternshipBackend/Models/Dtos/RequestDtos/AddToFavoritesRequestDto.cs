using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class AddToFavoritesRequestDto
    {
        public required string UserId { get; set; }
        public Guid BookId { get; set; }
    }
}