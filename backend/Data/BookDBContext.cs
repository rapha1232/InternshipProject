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

        // Author and Books relationship
        modelBuilder.Entity<Author>()
            .HasMany(a => a.Books)
            .WithOne(b => b.Author)
            .HasForeignKey(b => b.AuthorId)
            .OnDelete(DeleteBehavior.SetNull); // If an Author is deleted, set Book.AuthorId to NULL

        // Book and Reviews relationship
        modelBuilder.Entity<Book>()
            .HasMany(b => b.Reviews)
            .WithOne(r => r.Book)
            .HasForeignKey(r => r.BookId).OnDelete(DeleteBehavior.Cascade);

        // Ensure AuthorId is nullable
        modelBuilder.Entity<Book>()
            .Property(b => b.AuthorId)
            .IsRequired(false);
    }
}