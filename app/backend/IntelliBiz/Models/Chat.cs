namespace IntelliBiz.Models
{
    public class Chat
    {
        public int ChatId { get; set; }
        public int UserId { get; set; }
        public int BusinessId { get; set; }
        public DateTime InitiatedAt { get; set; }
    }

}
