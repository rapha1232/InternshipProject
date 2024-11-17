using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBacked.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public FavoritesController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("{userId:Guid}")]
        public async Task<ActionResult> GetUserFavorites([FromRoute] Guid userId)
        {
            var user = await _userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Id == userId.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var favs = user.Favorites;
            if (favs == null)
            {
                return NotFound("User has no favorites");
            }

            var favsResult = favs.Select(item => new
            {
                item.Id,
                item.BookId,
            }).ToList();

            return Ok(favsResult);
        }

        [HttpPost]
        public async Task<ActionResult> AddToFavorites([FromBody] AddToFavoritesRequestDto addToFavoritesRequestDto)
        {
            var user = await _userManager.Users
                                  .Include(u => u.Favorites)
                                  .FirstOrDefaultAsync(u => u.Id == addToFavoritesRequestDto.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            // Check if the favorite already exists for the user
            var existingFavorite = user.Favorites.FirstOrDefault(f => f.BookId == addToFavoritesRequestDto.BookId);
            if (existingFavorite != null)
            {
                return BadRequest("This book is already in the user's favorites");
            }

            var favsItem = new Favorite
            {
                Id = Guid.NewGuid(),
                UserId = addToFavoritesRequestDto.UserId,
                BookId = addToFavoritesRequestDto.BookId,
            };

            user.Favorites.Add(favsItem);
            await _userManager.UpdateAsync(user);

            return Ok("Book added to favorites");
        }

        [HttpDelete("{favsItemId:Guid}")]
        public async Task<ActionResult> DeleteFavoritesItem([FromRoute] Guid favsItemId)
        {
            var user = await _userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Favorites.Any(w => w.Id == favsItemId));
            if (user == null)
            {
                return NotFound("User with this favotite item not found");
            }

            var favsItem = user.Favorites.FirstOrDefault(w => w.Id == favsItemId);
            if (favsItem == null)
            {
                return NotFound("Favorites item not found");
            }

            user.Favorites.Remove(favsItem);
            await _userManager.UpdateAsync(user);

            return Ok("Favorites item removed");
        }
    }
}