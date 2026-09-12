using Microsoft.AspNetCore.Mvc;
using PurchaseBill.API.Models;
using PurchaseBill.API.Services.Interfaces;

namespace PurchaseBill.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new LoginResponse
                {
                    Success = false,
                    Message = "Email and password are required"
                });
            }

            var result = await _authService.LoginAsync(request);

            if (!result.Success)
                return Unauthorized(result);

            return Ok(result);
        }

        [HttpGet("locations")]
        public async Task<ActionResult<List<LocationDetail>>> GetLocations([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
                return BadRequest(new { message = "Email is required" });

            var locations = await _authService.GetLocationsByEmailAsync(email);
            return Ok(locations);
        }
    }
}
