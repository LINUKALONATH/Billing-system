using PurchaseBill.API.Models;

namespace PurchaseBill.API.Services.Interfaces
{
    public interface ILocationService
    {
        Task<List<LocationDetail>> GetLocationsByEmailAsync(string email);
    }
}
