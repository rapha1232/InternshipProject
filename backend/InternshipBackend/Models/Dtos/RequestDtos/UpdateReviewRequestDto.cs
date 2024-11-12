using System;

namespace InternshipBackend.Models.Dtos.RequestDtos
{
    public class UpdateReviewRequestDto
    {
        public required string Content { get; set; }
        public required int Rating { get; set; }
    }
}