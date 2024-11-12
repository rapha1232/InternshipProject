using InternshipBackend.Models.Domain;
using Microsoft.EntityFrameworkCore;

namespace InternshipBacked.Data;

public class BookDBContext : DbContext
{
    public BookDBContext(DbContextOptions<BookDBContext> dbContextOptions) : base(dbContextOptions)
    {
    }

    public DbSet<Book> Books { get; set; }
    public DbSet<Author> Authors { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Author>()
            .HasMany(a => a.Books)        // An Author has many Books
            .WithOne(b => b.Author)       // Each Book has one Author
            .HasForeignKey(b => b.AuthorId); // Set AuthorId as the foreign key

        modelBuilder.Entity<Book>()
            .HasMany(b => b.Reviews)      // A Book has many Reviews
            .WithOne(r => r.Book)         // Each Review has one Book
            .HasForeignKey(r => r.BookId); // Set BookId as the foreign key

    }
}