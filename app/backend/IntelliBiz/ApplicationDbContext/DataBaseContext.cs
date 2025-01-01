using IntelliBiz.Models;
using Microsoft.EntityFrameworkCore;

namespace IntelliBiz.ApplicationDbContext
{
    public class DatabaseContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Business> Businesses { get; set; }
        public DbSet<Review> Reviews { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasKey(u => u.Id);
            modelBuilder.Entity<Business>().HasKey(b => b.Id);
            modelBuilder.Entity<Review>().HasKey(r => r.Id);
        }
    }
}
