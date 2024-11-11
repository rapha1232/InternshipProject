using System;
using InternshipBackend.Models.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace InternshipBacked.Data;

public class AuthDBContext : IdentityDbContext<ApplicationUser>
{
    public AuthDBContext(DbContextOptions<AuthDBContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Add roles to Identity system
        var readerRoleId = "19242ef2-79df-4882-8178-268c16d5f331";
        var writerRoleId = "314ff3af-e379-4278-a767-f517e70131bd";

        var roles = new List<IdentityRole>
        {
            new IdentityRole
            {
                Id = writerRoleId,
                ConcurrencyStamp = writerRoleId,
                Name = "admin",
                NormalizedName = "ADMIN"
            },
            new IdentityRole
            {
                Id = readerRoleId,
                ConcurrencyStamp = readerRoleId,
                Name = "user",
                NormalizedName = "USER"
            }
        };

        modelBuilder.Entity<IdentityRole>().HasData(roles);
    }
}