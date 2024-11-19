using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBacked.Data;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using AutoMapper;
using InternshipBackend.Models.Dtos.RequestDtos;
using Microsoft.AspNetCore.Authorization;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ReviewsController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly BookDBContext _dbContext;
        private readonly IMapper _mapper;
        public ReviewsController(UserManager<ApplicationUser> userManager, BookDBContext dbContext, IMapper mapper)
        {
            _userManager = userManager;
            _dbContext = dbContext;
            _mapper = mapper;
        }

        [HttpGet("{bookId:Guid}")]
        public async Task<ActionResult> GetBookReviews([FromRoute] Guid bookId)
        {
            var book = await _dbContext.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == bookId);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            var reviews = book.Reviews;
            if (reviews == null)
            {
                return NotFound(new { message = "Book has no reviews" });
            }

            return Ok(new { message = "Success", reviews });
        }

        [HttpPost]
        public async Task<ActionResult> AddReview([FromBody] AddReviewRequestDto addReviewRequestDto)
        {
            var book = await _dbContext.Books.Include(b => b.Reviews).FirstOrDefaultAsync(b => b.Id == addReviewRequestDto.BookId);
            if (book == null)
            {
                return NotFound(new { message = "Book not found" });
            }

            var review = new Review
            {
                UserId = addReviewRequestDto.UserId.ToString(),
                BookId = addReviewRequestDto.BookId,
                Content = addReviewRequestDto.Content,
                Rating = addReviewRequestDto.Rating,
                ReviewDate = DateTime.Now
            };

            await _dbContext.Reviews.AddAsync(review);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Review Created Successfully" });
        }

        [HttpDelete("{reviewId:Guid}")]
        public async Task<ActionResult> DeleteReview([FromRoute] Guid reviewId)
        {
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            _dbContext.Reviews.Remove(review);
            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Review Deleted Successfully" });
        }

        [HttpPut("{reviewId:Guid}")]
        public async Task<ActionResult> UpdateReview([FromRoute] Guid reviewId, [FromBody] UpdateReviewRequestDto updateReviewRequestDto)
        {
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);
            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            review.Content = updateReviewRequestDto.Content;
            review.Rating = updateReviewRequestDto.Rating;

            await _dbContext.SaveChangesAsync();

            return Ok(new { message = "Review Updated Successfully" });
        }

        [HttpGet("userReviews")]
        public async Task<ActionResult> GetUserReviews()
        {
            var userId = HttpContext.Session.GetString("UserId");

            if (userId == null)
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            var reviews = await _dbContext.Reviews.Where(r => r.UserId == userId).ToListAsync();

            return Ok(new { message = "Success", reviews });
        }

        [HttpGet("userReview/{bookId:Guid}")]
        public async Task<ActionResult> GetUserReviewForOneBook([FromRoute] Guid bookId)
        {
            var userId = HttpContext.Session.GetString("UserId");

            if (userId == null)
            {
                return Unauthorized(new { message = "Unauthorized" });
            }

            var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.BookId == bookId);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            return Ok(new { message = "Success", review });
        }

        [HttpGet("review/{reviewId:Guid}")]
        public async Task<ActionResult> GetReview([FromRoute] Guid reviewId)
        {
            var review = await _dbContext.Reviews.FirstOrDefaultAsync(r => r.Id == reviewId);

            if (review == null)
            {
                return NotFound(new { message = "Review not found" });
            }

            return Ok(new { message = "Success", review });
        }

        [HttpGet("avgRating/{bookId:Guid}")]
        public async Task<ActionResult> GetAvgRating()
        {
            var avgRating = await _dbContext.Reviews.AverageAsync(r => r.Rating);

            return Ok(new { message = "Success", avgRating });
        }

        [HttpGet("totalReviews/{bookId:Guid}")]
        public async Task<ActionResult> GetTotalReviews([FromRoute] Guid bookId)
        {
            var totalReviews = await _dbContext.Reviews.CountAsync(r => r.BookId == bookId);

            return Ok(new { message = "Success", totalReviews });
        }

        [HttpGet("viewRatings/{bookId:Guid}")]
        public async Task<ActionResult> GetRatings()
        {
            var ratings = await _dbContext.Reviews.Select(r => r.Rating).ToListAsync();

            return Ok(new { message = "Success", ratings });
        }
    }
}