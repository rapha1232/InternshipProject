using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using InternshipBacked.Data;
using AutoMapper;
using InternshipBackend.Models.Domain;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize]
    public class BookController : ControllerBase
    {

        private readonly BookDBContext _context;
        private readonly IMapper _mapper;
        public BookController(BookDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            try
            {
                var books = await _context.Books.Include(b => b.Author).Include(b => b.Reviews).ToListAsync();

                if (books == null || !books.Any())
                {
                    return NotFound("No books found.");
                }

                var booksDto = _mapper.Map<IEnumerable<BookDto>>(books);
                return Ok(booksDto);
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
                var book = await _context.Books.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound("Book not found.");
                }

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving book.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] CreateBookRequestDto createBookRequestDto)
        {
            try
            {
                var book = _mapper.Map<Book>(createBookRequestDto);
                await _context.Books.AddAsync(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return CreatedAtAction(nameof(GetBook), new { id = book.Id }, bookDto);
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
                    return NotFound("Book not found.");
                }

                _mapper.Map(updateBookRequestDto, book);
                _context.Books.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(bookDto);
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
                    return NotFound("Book not found.");
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
                    return NotFound("Book not Found.");
                }

                var authorDto = _mapper.Map<AuthorDto>(book.Author);
                authorDto.Books.Add(_mapper.Map<BookWithoutAuthorDto>(book));
                return Ok(authorDto);
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
                    return NotFound("Book not found.");
                }

                book.toBeShown = true;
                _context.Books.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = _mapper.Map<BookDto>(book);
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while showing the book.", details = ex.Message });
            }
        }
    }
}