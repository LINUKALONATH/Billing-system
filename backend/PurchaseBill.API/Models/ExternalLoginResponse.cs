namespace PurchaseBill.API.Models
{
    public class ExternalLoginResponse
    {
        public bool Status { get; set; }
        public string? Message { get; set; }
        public ExternalLoginData? Data { get; set; }
    }

    public class ExternalLoginData
    {
        public string? Token { get; set; }
        public string? Username { get; set; }
        public string? FullName { get; set; }
        public List<UserLocation>? User_Locations { get; set; }
    }

    public class UserLocation
    {
        public string Location_Code { get; set; } = string.Empty;
        public string Location_Name { get; set; } = string.Empty;
    }
}
