namespace IntelliBiz.Models
{
    public class DemographicsData
    {
        public int Id { get; set; }
        public List<AgeGroup> Age { get; set; }
        public List<GenderGroup> Gender { get; set; }
        public List<LocationGroup> Location { get; set; }
    }
}
