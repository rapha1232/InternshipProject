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
            var user = await _userManager.Users
                             .Include(u => u.Wishlist)
                             .FirstOrDefaultAsync(u => u.Id == addToWishlistRequestDto.UserId);

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

            var existingWishlist = user.Wishlist.FirstOrDefault(w => w.BookId == addToWishlistRequestDto.BookId);
            if (existingWishlist != null)
            {
                return BadRequest("This book is already in the user's wishlist");
            }

            var wishlistItem = new WishlistItem
            {
                UserId = addToWishlistRequestDto.UserId,
                BookId = addToWishlistRequestDto.BookId,
                Read = addToWishlistRequestDto.Read,
            };



            wishlist.Add(wishlistItem);
            await _userManager.UpdateAsync(user);

            return Ok("Book added to wishlist");
        }

        [HttpPut("setReadStatus/{wishlistItemId:Guid}")]
        public async Task<ActionResult> SetReadStatus([FromRoute] Guid wishlistItemId, [FromBody] bool readStatus)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Wishlist.Any(w => w.Id == wishlistItemId));
            if (user == null)
            {
                return NotFound("User not found");
            }

            var wishlistItem = user.Wishlist.FirstOrDefault(w => w.Id == wishlistItemId);
            if (wishlistItem == null)
            {
                return NotFound("Wishlist item not found");
            }

            wishlistItem.Read = readStatus;
            await _userManager.UpdateAsync(user);

            return Ok("Read status updated");
        }

        [HttpDelete("{wishlistItemId:Guid}")]
        public async Task<ActionResult> DeleteWishlistItem([FromRoute] Guid wishlistItemId)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Wishlist.Any(w => w.Id == wishlistItemId));
            if (user == null)
            {
                return NotFound("User with this wishlist item not found");
            }

            var wishlistItem = user.Wishlist.FirstOrDefault(w => w.Id == wishlistItemId);
            if (wishlistItem == null)
            {
                return NotFound("Wishlist item not found");
            }

            user.Wishlist.Remove(wishlistItem);
            await _userManager.UpdateAsync(user);

            return Ok("Wishlist item removed");
        }
    }
}