using System;
using InternshipBackend.Models.Domain;

namespace InternshipBackend.Models.Dtos
{
    public class AuthorWithoutBooksDto
    {
        public Guid Id { get; set; }
        public required string Name { get; set; }
        public string? Biography { get; set; }
        public string? AuthorImageUrl { get; set; }
    }
}