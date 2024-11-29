using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using InternshipBackend.Models.Domain;
using InternshipBackend.Models.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using InternshipBacked.Data;


namespace InternshipBacked.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class WishlistController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;
        public WishlistController(UserManager<ApplicationUser> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet("{userId:Guid}")]
        public async Task<ActionResult> GetUserWishlist([FromRoute] Guid userId)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Id == userId.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var wishlist = user.Wishlist;

            if (wishlist == null || !wishlist.Any())
            {
                return Ok(new { message = "User has no wishlist", wishlist = new List<WishlistItemWithoutUserDto>() });
            }


            return Ok(new { message = "Success", wishlist = _mapper.Map<List<WishlistItemWithoutUserDto>>(wishlist) });
        }

        [HttpPost]
        public async Task<ActionResult> AddToWishlist([FromBody] AddToWishlistRequestDto addToWishlistRequestDto)
        {
            var user = await _userManager.Users
                             .Include(u => u.Wishlist)
                             .FirstOrDefaultAsync(u => u.Id == addToWishlistRequestDto.UserId);

            if (user == null)
            {
                return NotFound(new { message = "User not found" });
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
                return BadRequest(new { message = "This book is already in the user's wishlist" });
            }

            var wishlistItem = new WishlistItem
            {
                UserId = addToWishlistRequestDto.UserId,
                BookId = addToWishlistRequestDto.BookId,
                Read = addToWishlistRequestDto.Read,
            };



            wishlist.Add(wishlistItem);
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Book added to wishlist", wishlistItem = _mapper.Map<WishlistItemWithoutUserDto>(wishlistItem) });
        }

        [HttpPut("setReadStatus/{wishlistItemId:Guid}")]
        public async Task<ActionResult> SetReadStatus([FromRoute] Guid wishlistItemId, [FromBody] bool readStatus)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Wishlist.Any(w => w.Id == wishlistItemId));
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var wishlistItem = user.Wishlist.FirstOrDefault(w => w.Id == wishlistItemId);
            if (wishlistItem == null)
            {
                return NotFound(new { message = "Wishlist item not found" });
            }

            wishlistItem.Read = readStatus;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Read status updated", wishlistItem = _mapper.Map<WishlistItemWithoutUserDto>(wishlistItem) });
        }

        [HttpDelete("{wishlistItemId:Guid}")]
        public async Task<ActionResult> DeleteWishlistItem([FromRoute] Guid wishlistItemId)
        {
            var user = await _userManager.Users.Include(u => u.Wishlist).FirstOrDefaultAsync(u => u.Wishlist.Any(w => w.Id == wishlistItemId));
            if (user == null)
            {
                return NotFound(new { message = "User with this wishlist item not found" });
            }

            var wishlistItem = user.Wishlist.FirstOrDefault(w => w.Id == wishlistItemId);
            if (wishlistItem == null)
            {
                return NotFound(new { message = "Wishlist item not found" });
            }

            user.Wishlist.Remove(wishlistItem);
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Wishlist item removed", wishlistItem = _mapper.Map<WishlistItemWithoutUserDto>(wishlistItem) });
        }
    }
}