
using IntelliBiz.Models;
using IntelliBiz.Repositories.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IntelliBiz.Controllers;

public class AppointmentController : BaseController
{
    private readonly IAppointmentRepository _appointmentRepository;
    private readonly ILogger<AppointmentController> _logger;

    public AppointmentController(IAppointmentRepository appointmentRepository, ILogger<AppointmentController> logger)
    {
        _appointmentRepository = appointmentRepository;
        _logger = logger;
    }

    [Authorize]
    [HttpPost("businesses/{businessId}")]
    public async Task<IActionResult> CreateAppointment(int businessId, [FromBody] CreateAppointmentRequest request)
    {
        try
        {
            var userId = GetUserId();
            var appointment = await _appointmentRepository.CreateAppointmentAsync(businessId, userId, request);
            return CreatedAtAction(nameof(GetUserAppointments), new { }, appointment);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating appointment");
            return HandleException(ex);
        }
    }

    [Authorize(Roles = "BusinessOwner")]
    [HttpGet("businesses/{businessId}")]
    public async Task<IActionResult> GetBusinessAppointments(int businessId, [FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
    {
        try
        {
            var appointments = await _appointmentRepository.GetBusinessAppointmentsAsync(businessId, startDate, endDate);
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting business appointments");
            return HandleException(ex);
        }
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetUserAppointments()
    {
        try
        {
            var userId = GetUserId();
            var appointments = await _appointmentRepository.GetUserAppointmentsAsync(userId);
            return Ok(appointments);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user appointments");
            return HandleException(ex);
        }
    }

    [Authorize(Roles = "BusinessOwner")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] UpdateAppointmentStatusRequest request)
    {
        try
        {
            await _appointmentRepository.UpdateAppointmentStatusAsync(id, request.Status);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating appointment status");
            return HandleException(ex);
        }
    }
} 