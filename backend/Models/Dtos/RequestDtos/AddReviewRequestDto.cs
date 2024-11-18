using System;

namespace InternshipBackend.Models.Dtos
{
    public class AddReviewRequestDto
    {
        public Guid BookId { get; set; }
        public Guid UserId { get; set; }
        public string Content { get; set; }
        public int Rating { get; set; }
    }
}