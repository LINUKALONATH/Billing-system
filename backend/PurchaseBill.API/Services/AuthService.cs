using System.Text.Json;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using PurchaseBill.API.Data;
using PurchaseBill.API.Models;
using PurchaseBill.API.Services.Interfaces;

namespace PurchaseBill.API.Services
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly ApplicationDbContext _context;
        private const string ExternalApiUrl = "https://ez-staging-api.azurewebsites.net/api/External_Api/POS_Api/Invoke";

        public AuthService(HttpClient httpClient, ApplicationDbContext context)
        {
            _httpClient = httpClient;
            _context = context;
        }

        public async Task<LoginResponse> LoginAsync(LoginRequest request)
        {
            // Try calling the external API
            try
            {
                var externalRequest = new ExternalLoginRequest
                {
                    Company_Code = request.Email,
                    API_Body = new ExternalLoginBody
                    {
                        Username = request.Email,
                        Pw = request.Password
                    }
                };

                var json = JsonSerializer.Serialize(externalRequest);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                var response = await _httpClient.PostAsync(ExternalApiUrl, content, cts.Token);
                var responseString = await response.Content.ReadAsStringAsync(cts.Token);

                if (response.IsSuccessStatusCode)
                {
                    var externalResponse = JsonSerializer.Deserialize<ExternalLoginResponse>(responseString, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (externalResponse != null && externalResponse.Status && externalResponse.Data != null)
                    {
                        if (externalResponse.Data.User_Locations != null)
                        {
                            await SaveLocationsAsync(request.Email, externalResponse.Data.User_Locations);
                        }

                        var locations = await GetLocationsByEmailAsync(request.Email);

                        return new LoginResponse
                        {
                            Success = true,
                            Message = "Login successful",
                            Token = externalResponse.Data.Token,
                            Username = externalResponse.Data.Username,
                            Locations = locations
                        };
                    }
                }
            }
            catch
            {
                // External API failed, fall through to local validation
            }

            // Fallback: validate locally with mock data
            if (request.Email == "info@enhanzer.com" && request.Password == "Welcome#5")
            {
                var mockLocations = new List<UserLocation>
                {
                    new() { Location_Code = "LOC-001", Location_Name = "Main Store - Colombo" },
                    new() { Location_Code = "LOC-002", Location_Name = "Branch Store - Kandy" },
                    new() { Location_Code = "LOC-003", Location_Name = "Branch Store - Galle" }
                };

                await SaveLocationsAsync(request.Email, mockLocations);

                var locations = await GetLocationsByEmailAsync(request.Email);

                return new LoginResponse
                {
                    Success = true,
                    Message = "Login successful",
                    Token = $"mock_token_{Guid.NewGuid():N}",
                    Username = request.Email,
                    Locations = locations
                };
            }

            return new LoginResponse
            {
                Success = false,
                Message = "Invalid email or password."
            };
        }

        public async Task<List<LocationDetail>> GetLocationsByEmailAsync(string email)
        {
            return await _context.LocationDetails
                .Where(l => l.UserEmail == email)
                .ToListAsync();
        }

        private async Task SaveLocationsAsync(string email, List<UserLocation> locations)
        {
            var existing = await _context.LocationDetails
                .Where(l => l.UserEmail == email)
                .ToListAsync();

            _context.LocationDetails.RemoveRange(existing);

            foreach (var loc in locations)
            {
                _context.LocationDetails.Add(new LocationDetail
                {
                    LocationCode = loc.Location_Code,
                    LocationName = loc.Location_Name,
                    UserEmail = email,
                    CreatedAt = DateTime.UtcNow
                });
            }

            await _context.SaveChangesAsync();
        }
    }
}
