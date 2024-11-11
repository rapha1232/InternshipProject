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

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Author>()
            .HasMany(a => a.Books)        // An Author has many Books
            .WithOne(b => b.Author)       // Each Book has one Author
            .HasForeignKey(b => b.AuthorId); // Set AuthorId as the foreign key
    }
}