using Microsoft.EntityFrameworkCore;
using PurchaseBill.API.Models;

namespace PurchaseBill.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }

        public DbSet<LocationDetail> LocationDetails { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<LocationDetail>(entity =>
            {
                entity.ToTable("Location_Details");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.LocationCode).IsRequired().HasMaxLength(50);
                entity.Property(e => e.LocationName).IsRequired().HasMaxLength(200);
                entity.Property(e => e.UserEmail).IsRequired().HasMaxLength(200);
            });
        }
    }
}
