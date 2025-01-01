namespace IntelliBiz.Models
{
    public class Review
    {
        public int Id { get; set; }
        public int BusinessId { get; set; }
        public string Comment { get; set; }
        public int Rating { get; set; }
        public Business Business { get; set; }
    }
}
