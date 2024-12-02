using System;
using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class CreateAuthorRequestDto
    {
        public required string Name { get; set; }
        public string? Biography { get; set; }
        public IFormFile? AuthorImageUrl { get; set; }
    }
}