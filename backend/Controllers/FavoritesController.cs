using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBacked.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class FavoritesController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        public FavoritesController(UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("{userId:Guid}")]
        public async Task<ActionResult> GetUserFavorites([FromRoute] Guid userId)
        {
            var user = await _userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Id == userId.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var favs = user.Favorites;
            if (favs == null)
            {
                return NotFound(new { message = "User has no favorites" });
            }

            var favsResult = _mapper.Map<List<FavoriteWithoutUserDto>>(favs);

            return Ok(new { message = "Success", favorites = favsResult });
        }

        [HttpPost]
        public async Task<ActionResult> AddToFavorites([FromBody] AddToFavoritesRequestDto addToFavoritesRequestDto)
        {
            var user = await _userManager.Users
                                  .Include(u => u.Favorites)
                                  .FirstOrDefaultAsync(u => u.Id == addToFavoritesRequestDto.UserId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Check if the favorite already exists for the user
            var existingFavorite = user.Favorites.FirstOrDefault(f => f.BookId == addToFavoritesRequestDto.BookId);
            if (existingFavorite != null)
            {
                return BadRequest(new { message = "This book is already in the user's favorites" });
            }

            var favItem = new Favorite
            {
                UserId = addToFavoritesRequestDto.UserId,
                BookId = addToFavoritesRequestDto.BookId,
            };

            user.Favorites.Add(favItem);
            await _userManager.UpdateAsync(user);

            var favItemRes = _mapper.Map<FavoriteWithoutUserDto>(favItem);

            return Ok(new { message = "success Book added to favorites", favItem = favItemRes });
        }

        [HttpDelete("{favsItemId:Guid}")]
        public async Task<ActionResult> DeleteFavoritesItem([FromRoute] Guid favsItemId)
        {
            var user = await _userManager.Users.Include(u => u.Favorites).FirstOrDefaultAsync(u => u.Favorites.Any(w => w.Id == favsItemId));
            if (user == null)
            {
                return NotFound(new { message = "User with this favotite item not found" });
            }

            var favItem = user.Favorites.FirstOrDefault(w => w.Id == favsItemId);
            if (favItem == null)
            {
                return NotFound(new { message = "Favorites item not found" });
            }

            user.Favorites.Remove(favItem);
            await _userManager.UpdateAsync(user);

            var favItemRes = _mapper.Map<FavoriteWithoutUserDto>(favItem);

            return Ok(new { message = "success Favorites item removed", favItem = favItemRes });
        }
    }
}