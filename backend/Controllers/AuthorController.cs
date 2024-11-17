using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using InternshipBacked.Data;
using AutoMapper;
using InternshipBackend.Models.Domain;
using Microsoft.AspNetCore.Authorization;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuthorController : ControllerBase
    {

        private readonly BookDBContext _context;
        private readonly IMapper _mapper;
        public AuthorController(BookDBContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAuthors()
        {
            try
            {
                var authors = await _context.Authors.Include(a => a.Books).ToListAsync();

                if (authors == null || !authors.Any())
                {
                    return NotFound(new { message = "No authors found." });
                }

                var authorsDto = _mapper.Map<IEnumerable<AuthorDto>>(authors);
                return Ok(new { message = "success", authors = authorsDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving authors.", details = ex.Message });
            }
        }


        [HttpGet("{id:Guid}")]
        public async Task<IActionResult> GetAuthor([FromRoute] Guid id)
        {
            try
            {
                var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.Id == id);

                if (author == null)
                {
                    return NotFound(new { message = "Author not found." });
                }

                var authorDto = _mapper.Map<AuthorDto>(author);
                return Ok(new { message = "success", author = authorDto });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while retrieving the author.", details = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAuthor([FromBody] CreateAuthorRequestDto createAuthorDto)
        {
            try
            {
                var author = _mapper.Map<Author>(createAuthorDto);

                await _context.Authors.AddAsync(author);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAuthor), new { id = author.Id }, new { message = "Author created successfully.", author });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while creating the author.", details = ex.Message });
            }
        }

        [HttpPut]
        [Route("{id:Guid}")]
        public async Task<IActionResult> UpdateAuthor([FromRoute] Guid id, [FromBody] CreateAuthorRequestDto createAuthorDto)
        {
            var author = await _context.Authors.FirstOrDefaultAsync(a => a.Id == id);

            if (author == null)
            {
                return NotFound(new { message = "Author not found." });
            }

            try
            {
                _mapper.Map(createAuthorDto, author);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Error mapping data to author entity.", details = ex.Message });
            }

            try
            {
                _context.Authors.Update(author);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return Conflict(new { message = "Failed to update author in the database.", details = ex.Message });
            }

            return Ok(new { message = "Author updated successfully." });
        }

        [HttpDelete]
        [Route("{id:Guid}")]
        public async Task<IActionResult> DeleteAuthor([FromRoute] Guid id)
        {
            var author = await _context.Authors.FirstOrDefaultAsync(a => a.Id == id);

            if (author == null)
            {
                return NotFound(new { message = "Author not found." });
            }

            try
            {
                _context.Authors.Remove(author);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return Conflict(new { message = "Failed to delete author from the database.", details = ex.Message });
            }

            return Ok(new { message = "Author deleted successfully." });
        }

        [HttpPut]
        [Route("{authorId:Guid}/add-books")]
        public async Task<IActionResult> AddBooksToAuthor([FromRoute] Guid authorId, [FromBody] List<Guid> bookIds)
        {
            var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.Id == authorId);

            if (author == null)
            {
                return NotFound(new { message = "Author not found." });
            }

            if (bookIds == null || !bookIds.Any())
            {
                return BadRequest(new { message = "No book IDs provided." });
            }

            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

            var missingBooks = bookIds.Except(books.Select(b => b.Id)).ToList();
            if (missingBooks.Any())
            {
                return NotFound(new { message = $"The following books were not found: {string.Join(", ", missingBooks)}" });
            }

            author.Books.AddRange(books);

            try
            {
                _context.Authors.Update(author);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return Conflict(new { message = "Failed to add books to author in the database.", details = ex.Message });
            }

            return Ok(new { message = $"{books.Count} book(s) added to the author successfully." });
        }

        [HttpPut]
        [Route("{authorId:Guid}/remove-books")]
        public async Task<IActionResult> RemoveBooksFromAuthor([FromRoute] Guid authorId, [FromBody] List<Guid> bookIds)
        {
            var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.Id == authorId);

            if (author == null)
            {
                return NotFound(new { message = "Author not found." });
            }

            if (bookIds == null || !bookIds.Any())
            {
                return BadRequest(new { message = "No book IDs provided." });
            }

            var books = await _context.Books.Where(b => bookIds.Contains(b.Id)).ToListAsync();

            var missingBooks = bookIds.Except(books.Select(b => b.Id)).ToList();
            if (missingBooks.Any())
            {
                return NotFound(new { message = $"The following books were not found: {string.Join(", ", missingBooks)}" });
            }

            author.Books.RemoveAll(b => bookIds.Contains(b.Id));

            try
            {
                _context.Authors.Update(author);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                return Conflict(new { message = "Failed to remove books from author in the database.", details = ex.Message });
            }

            return Ok(new { message = $"{books.Count} book(s) removed from the author successfully." });
        }

        [HttpGet]
        [Route("{authorId:Guid}/books")]
        public async Task<IActionResult> GetBooksByAuthor([FromRoute] Guid authorId)
        {
            var author = await _context.Authors.Include(a => a.Books).FirstOrDefaultAsync(a => a.Id == authorId);

            if (author == null)
            {
                return NotFound(new { message = "Author not found." });
            }

            var books = author.Books;

            if (books == null || !books.Any())
            {
                return NotFound(new { message = "No books found for the author." });
            }

            var booksDto = _mapper.Map<IEnumerable<BookDto>>(books);
            return Ok(new { message = "success", books = booksDto });
        }

    }
}