using System;
using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class CreateAuthorRequestDto
    {
        public string Name { get; set; }
        public string? Biography { get; set; }
        public string? AuthorImageUrl { get; set; }
    }
}