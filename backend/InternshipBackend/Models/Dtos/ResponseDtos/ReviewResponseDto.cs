using System;

namespace InternshipBackend.Models.Dtos
{
    public class ReviewResponseDto
    {
        public Guid Id { get; set; }
        public required string UserId { get; set; }
        public Guid BookId { get; set; }
        public required string Content { get; set; }
        public int Rating { get; set; }
        public DateTime ReviewDate { get; set; }
    }
}