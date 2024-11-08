using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBacked.Models.DTOs;
using InternshipBacked.Repositories;
using InternshipBackend.Models.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using InternshipBackend.CustomActionFilters;
using System.ComponentModel.DataAnnotations;
using Microsoft.Identity.Client;
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
        private readonly IMapper mapper;
        public BookController(BookDBContext context, IMapper mapper)
        {
            _context = context;
            this.mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBooks()
        {
            try
            {
                var books = await _context.Book.Include(b => b.Author).ToListAsync();

                if (books == null || !books.Any())
                {
                    return NotFound("No books found.");
                }

                var booksDto = mapper.Map<IEnumerable<BookDto>>(books);
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
                var book = await _context.Book.Include(b => b.Author).FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound("Book not found.");
                }

                var bookDto = mapper.Map<BookDto>(book);
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
                var book = mapper.Map<Book>(createBookRequestDto);
                await _context.Book.AddAsync(book);
                await _context.SaveChangesAsync();

                var bookDto = mapper.Map<BookDto>(book);
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
                var book = await _context.Book.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound("Book not found.");
                }

                mapper.Map(updateBookRequestDto, book);
                _context.Book.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = mapper.Map<BookDto>(book);
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
                var book = await _context.Book.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound("Book not found.");
                }

                _context.Book.Remove(book);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Book deleted successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while deleting the book.", details = ex.Message });
            }
        }

        [HttpGet("author/{authorId:Guid}")]
        public async Task<IActionResult> GetBooksByAuthor([FromRoute] Guid authorId)
        {
            try
            {
                var books = await _context.Book.Include(b => b.Author).Where(b => b.AuthorId == authorId).ToListAsync();

                if (books == null || !books.Any())
                {
                    return NotFound("No books found for the author.");
                }

                var booksDto = mapper.Map<IEnumerable<BookDto>>(books);
                return Ok(booksDto);
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
                var book = await _context.Book.FirstOrDefaultAsync(b => b.Id == id);

                if (book == null)
                {
                    return NotFound("Book not found.");
                }

                book.toBeShown = true;
                _context.Book.Update(book);
                await _context.SaveChangesAsync();

                var bookDto = mapper.Map<BookDto>(book);
                return Ok(bookDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while showing the book.", details = ex.Message });
            }
        }
    }
}