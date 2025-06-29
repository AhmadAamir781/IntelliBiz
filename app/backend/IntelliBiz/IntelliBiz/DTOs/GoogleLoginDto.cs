namespace IntelliBiz.DTOs
{
    public class GoogleLoginDto
    {
        public string IdToken { get; set; }
    }
    public class GoogleUserInfo
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Picture { get; set; }
    }

}
