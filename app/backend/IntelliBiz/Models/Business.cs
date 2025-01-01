namespace IntelliBiz.Models
{
    public class Business
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string ContactNumber { get; set; }
        public string WhatsApp { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
    }
}
