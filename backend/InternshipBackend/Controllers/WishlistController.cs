using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using InternshipBacked.Data;
using Microsoft.EntityFrameworkCore;

namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        public WishlistController(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("{userId:Guid}")]
        public async Task<ActionResult> GetUserWishlist([FromRoute] Guid userId)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Id == userId.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var wishlist = user.Wishlist;
            if (wishlist == null)
            {
                return NotFound("User has no wishlist");
            }

            var wishlistResult = wishlist.Select(item => new
            {
                item.Id,
                item.BookId,
                item.Read
            }).ToList();

            return Ok(wishlistResult);
        }

        [HttpPost]
        public async Task<ActionResult> AddToWishlist([FromBody] AddToWishlistRequestDto addToWishlistRequestDto)
        {
            var user = await _userManager.FindByIdAsync(addToWishlistRequestDto.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            var wishlist = user.Wishlist;
            if (wishlist == null)
            {
                wishlist = new List<WishlistItem>();
                user.Wishlist = wishlist;
            }

            var wishlistItem = new WishlistItem
            {
                UserId = addToWishlistRequestDto.UserId,
                BookId = addToWishlistRequestDto.BookId,
                Read = addToWishlistRequestDto.Read,
            };



            wishlist.Add(wishlistItem);
            await _userManager.UpdateAsync(user);

            return Ok();
        }
    }
}