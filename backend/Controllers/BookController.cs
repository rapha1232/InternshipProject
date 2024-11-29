using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using InternshipBacked.Data;
using AutoMapper;
using InternshipBackend.Models.Domain;
using Microsoft.AspNetCore.Authorization;
using InternshipBacked.Services;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class BookController : ControllerBase
    {

        private readonly BookDBContext _context;
        private readonly IMapper _mapper;
        private IFileService _fileService;
        public BookController(BookDBContext context, IMapper mapper, IFileService fileService)
        {
            _context = context;
            _mapper = mapper;
            _fileService = fileService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            try
            {
                var books = await _context.Books.Include(b => b.Author).Include(b => b.Reviews).ToListAsync();

                if (books == null || !books.Any())
                {
                    return NotFound(new { message = "No books found." });
                }

                // Map books to BookDto with additional calculations for average rating and review count
                var booksDto = books.Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Description = book.Description,
                    Summary = book.Summary,
                    Author = _mapper.Map<AuthorWithoutBooksDto>(book.Author),
                    BookImageUrl = book.BookImageUrl,
                    toBeShown = book.toBeShown,
                    AverageRating = book.Reviews.Any() ? book.Reviews.Average(r => r.Rating) : (double?)null,
                    Reviews = book.Reviews.Select(r => _mapper.Map<ReviewWithoutBookDto>(r)).ToList()
                });

                return Ok(new { message = "success", books = booksDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving books.", details = ex.Message });
            }
        }

        [HttpGet("published")]
        public async Task<IActionResult> GetAllPublishedBooks()
        {
            try
            {
                var books = await _context.Books.Include(b => b.Author).Include(b => b.Reviews).Where(b => b.toBeShown).ToListAsync();

                if (books == null || !books.Any())
                {
                    return NotFound(new { message = "No books found." });
                }

                // Map books to BookDto with additional calculations for average rating and review count
                var booksDto = books.Select(book => new BookDto
                {
                    Id = book.Id,
                    Title = book.Title,
                    Description = book.Description,
                    Summary = book.Summary,
                    Author = _mapper.Map<AuthorWithoutBooksDto>(book.Author),
                    BookImageUrl = book.BookImageUrl,
                    toBeShown = book.toBeShown,
                    AverageRating = book.Reviews.Any() ? book.Reviews.Average(r => r.Rating) : (double?)null,
                    Reviews = book.Reviews.Select(r => _mapper.Map<ReviewWithoutBookDto>(r)).ToList()
                });

                return Ok(new { message = "success", books = booksDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving books.", details = ex.Message });
            }
        }

        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetBook([FromRoute] Guid id)
        {
            try
            {
                var book = await _context.Books.Include(b => b.Author).Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound(new { message = "Book not found." });
                }

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(new { message = "success", book = bookDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving book.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromForm] CreateBookRequestDto createBookRequestDto)
        {
            try
            {
                if (createBookRequestDto.BookImage?.Length > 4 * 1024 * 1024)
                {
                    return BadRequest(new { message = "File size should not exceed 4 MB" });
                }
                string[] allowedFileExtentions = [".jpg", ".jpeg", ".png"];
                string createdImageName = await _fileService.SaveFileAsync(createBookRequestDto.BookImage, allowedFileExtentions);

                var book = new Book()
                {
                    Title = createBookRequestDto.Title,
                    Description = createBookRequestDto.Description,
                    Summary = createBookRequestDto.Summary,
                    BookImageUrl = createdImageName,
                    toBeShown = false,
                    AuthorId = createBookRequestDto.AuthorId,
                };
                await _context.Books.AddAsync(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, new { message = "success", book = bookDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the book.", details = ex.Message });
            }
        }

        [HttpPut("{id:Guid}")]
        public async Task<IActionResult> UpdateBook([FromRoute] Guid id, [FromBody] CreateBookRequestDto updateBookRequestDto)
        {
            try
            {
                var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound(new { message = "Book not found." });
                }

                _mapper.Map(updateBookRequestDto, book);
                _context.Books.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(new { message = "success", book = bookDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while updating the book.", details = ex.Message });
            }
        }

        [HttpDelete("{id:Guid}")]
        public async Task<IActionResult> DeleteBook([FromRoute] Guid id)
        {
            try
            {
                var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound(new { message = "Book not found." });
                }

                _context.Books.Remove(book);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Book deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the book.", details = ex.Message });
            }
        }

        [HttpGet("author/{bookId:Guid}")]
        public async Task<IActionResult> GetAuthor([FromRoute] Guid bookId)
        {
            try
            {
                var book = await _context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == bookId);

                if (book == null)
                {
                    return NotFound(new { message = "Book not Found." });
                }

                var authorDto = _mapper.Map<AuthorDto>(book.Author);
                authorDto.Books.Add(_mapper.Map<BookWithoutAuthorDto>(book));
                return Ok(new { message = "success", author = authorDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving books for the author.", details = ex.Message });
            }
        }

        [HttpPut("show/{id:Guid}")]
        public async Task<IActionResult> ShowBook([FromRoute] Guid id)
        {
            try
            {
                var book = await _context.Books.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound(new { message = "Book not found." });
                }

                book.toBeShown = !book.toBeShown;
                _context.Books.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(new { message = "success, book set to " + (book.toBeShown == true ? "Published" : "Not Published"), book = bookDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while showing the book.", details = ex.Message });
            }
        }
    }
}