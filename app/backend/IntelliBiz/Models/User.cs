using System.ComponentModel.DataAnnotations;
using Swashbuckle.AspNetCore.Annotations;
namespace IntelliBiz.Models
{
    public class User
    {
        public User()
        {
            Name = Email = Password = Phone = Address = Role = string.Empty;
        }
        public int UserId { get; set; }

        [Required(ErrorMessage = "Name is required.")]
        [StringLength(50, ErrorMessage = "Name cannot exceed 50 characters.")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Email is required.")]
        [EmailAddress(ErrorMessage = "Invalid email format.")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Password is required.")]
        [StringLength(100, MinimumLength = 6, ErrorMessage = "Password must be between 6 and 100 characters.")]
        [RegularExpression(@"^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,100}$", ErrorMessage = "Password must contain at least one letter, one number, and one special character.")]
        public string Password { get; set; }


        [Phone(ErrorMessage = "Invalid phone number format.")]
        [Required(ErrorMessage = "Phone number is required.")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Address is required.")]
        [StringLength(200, ErrorMessage = "Address cannot exceed 200 characters.")]
        public string Address { get; set; }

        [Required(ErrorMessage = "Role is required.")]
        [RegularExpression("^(Admin|User|Shopkeeper)$", ErrorMessage = "Role must be either Admin, User, or Shopkeeper.")]
        public string Role { get; set; }
    }

}
