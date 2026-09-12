using PurchaseBill.API.Models;

namespace PurchaseBill.API.Services.Interfaces
{
    public interface IAuthService
    {
        Task<LoginResponse> LoginAsync(LoginRequest request);
        Task<List<LocationDetail>> GetLocationsByEmailAsync(string email);
    }
}
