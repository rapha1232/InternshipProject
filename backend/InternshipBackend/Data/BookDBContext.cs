using InternshipBackend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace InternshipBacked.Data
{
    public class BookDBContext : DbContext
    {
        public BookDBContext(DbContextOptions<BookDBContext> dbContextOptions) : base(dbContextOptions)
        {

        }

        public DbSet<Book> Book { get; set; }
        public DbSet<Author> Author { get; set; }
        public DbSet<Wishlist> Wishlist { get; set; }
        public DbSet<Favorite> Favorite { get; set; }
        public DbSet<Rating> Rating { get; set; }
        public DbSet<Review> Review { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Author>()
            .HasMany(a => a.Books)        // An Author has many Books
            .WithOne(b => b.Author)       // Each Book has one Author
            .HasForeignKey(b => b.AuthorId); // Set AuthorId as the foreign key

            modelBuilder.Entity<Wishlist>()
                .HasKey(w => new { w.UserId, w.BookId });

            // modelBuilder.Entity<Wishlist>()
            //     .HasOne(w => w.IdentityUser)
            //     .WithMany(u => u.Wishlist)
            //     .HasForeignKey(w => w.UserId)
            //     .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Wishlist>()
           .HasOne(w => w.Book)
           .WithMany(b => b.Wishlist)
           .HasForeignKey(w => w.BookId)
           .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                 .HasKey(r => new { r.UserId, r.BookId });

            // Configuring the relationships
            // modelBuilder.Entity<Review>()
            //     .HasOne(r => r.IdentityUser)
            //     .WithMany(u => u.Review)
            //     .HasForeignKey(r => r.UserId)
            //     .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Review>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Review)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
                .HasKey(r => new { r.UserId, r.BookId });

            // Configuring the relationships
            // modelBuilder.Entity<Rating>()
            //     .HasOne(r => r.IdentityUser)
            //     .WithMany(u => u.Ratings)
            //     .HasForeignKey(r => r.UserId)
            //     .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Rating>()
                .HasOne(r => r.Book)
                .WithMany(b => b.Rating)
                .HasForeignKey(r => r.BookId)
                .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
