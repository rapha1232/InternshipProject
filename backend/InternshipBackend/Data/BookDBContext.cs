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

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }
}
