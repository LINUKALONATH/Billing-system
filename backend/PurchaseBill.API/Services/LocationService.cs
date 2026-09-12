using PurchaseBill.API.Models;
using PurchaseBill.API.Services.Interfaces;

namespace PurchaseBill.API.Services
{
    public class LocationService : ILocationService
    {
        private readonly IAuthService _authService;

        public LocationService(IAuthService authService)
        {
            _authService = authService;
        }

        public async Task<List<LocationDetail>> GetLocationsByEmailAsync(string email)
        {
            return await _authService.GetLocationsByEmailAsync(email);
        }
    }
}
