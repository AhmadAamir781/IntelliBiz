using Microsoft.AspNetCore.Mvc;

using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
namespace IntelliBiz.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentController(IAppointmentRepository appointmentRepository) : ControllerBase
    {
        // GET: api/appointment/{businessId}
        [HttpGet("{businessId}")]
        public async Task<IActionResult> GetAllAppointments(int businessId)
        {
            var appointments = await appointmentRepository.GetAllAppointmentsAsync(businessId);
            if (appointments == null)
            {
                return NotFound("No appointments found.");
            }

            return Ok(appointments);
        }

        // GET: api/appointment/{appointmentId}
        [HttpGet("{appointmentId}")]
        public async Task<IActionResult> GetAppointment(int appointmentId)
        {
            var appointment = await appointmentRepository.ReadAppointmentAsync(appointmentId);
            if (appointment == null)
            {
                return NotFound("Appointment not found.");
            }

            return Ok(appointment);
        }

        // POST: api/appointment
        [HttpPost]
        public async Task<IActionResult> CreateAppointment([FromBody] Appointment appointment)
        {
            if (appointment == null)
            {
                return BadRequest("Appointment data is required.");
            }

            var result = await appointmentRepository.CreateAppointmentAsync(appointment);

            if (result > 0)
            {
                return Ok("Appointment created successfully.");
            }

            return StatusCode(500, "Error creating appointment.");
        }

        // PUT: api/appointment/{appointmentId}
        [HttpPut("{appointmentId}")]
        public async Task<IActionResult> UpdateAppointment(int appointmentId, [FromBody] Appointment appointment)
        {
            if (appointment == null || appointment.AppointmentId != appointmentId)
            {
                return BadRequest("Invalid appointment data.");
            }

            var result = await appointmentRepository.UpdateAppointmentAsync(appointment);

            if (result > 0)
            {
                return Ok("Appointment updated successfully.");
            }

            return StatusCode(500, "Error updating appointment.");
        }

        // DELETE: api/appointment/{appointmentId}
        [HttpDelete("{appointmentId}")]
        public async Task<IActionResult> DeleteAppointment(int appointmentId)
        {
            var result = await appointmentRepository.DeleteAppointmentAsync(appointmentId);

            if (result > 0)
            {
                return Ok("Appointment deleted successfully.");
            }

            return StatusCode(500, "Error deleting appointment.");
        }
    }

}
