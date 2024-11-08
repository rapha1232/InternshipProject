using AutoMapper;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;

namespace InternshipBacked.Mappings;

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<Author, AuthorDto>().ReverseMap();
        CreateMap<Author, AuthorWithoutBooksDto>().ReverseMap();
        CreateMap<Author, CreateAuthorRequestDto>().ReverseMap();
        CreateMap<Book, BookDto>().ReverseMap();
        CreateMap<Book, BookWithoutAuthorDto>().ReverseMap();
        CreateMap<Book, CreateBookRequestDto>().ReverseMap();
    }
}
