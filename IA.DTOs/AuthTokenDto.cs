using Newtonsoft.Json;

namespace AI.DTOs
{
    public class AuthTokenDto
    {
        [JsonProperty(PropertyName= "access_token")]
        public string Token { get; set; }
        [JsonProperty(PropertyName ="expires_in")]
        public double ExpiresIn { get; set; }
        [JsonProperty(PropertyName ="refresh_token")]
        public string  RefreshToken { get; set; }
    }
}
