using System.ComponentModel.DataAnnotations;
using IntelliBiz.Models;

namespace IntelliBiz.Models;

public class Appointment
{
    public int AppointmentId { get; set; }
    public int BusinessId { get; set; }
    public int UserId { get; set; }

    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required]
    public TimeSpan AppointmentTime { get; set; }

    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Notes { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    // Navigation properties
    public Business? Business { get; set; }
    public User? User { get; set; }
}

public class CreateAppointmentRequest
{
    [Required]
    public DateTime AppointmentDate { get; set; }

    [Required]
    public TimeSpan AppointmentTime { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }
}

public class UpdateAppointmentStatusRequest
{
    [Required]
    [MaxLength(20)]
    public string Status { get; set; } = string.Empty;
}

public class AppointmentResponse
{
    public int AppointmentId { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessAddress { get; set; } = string.Empty;
}