namespace IntelliBiz.Repositories
{
    using Dapper;
    using Microsoft.Data.SqlClient;
    using Microsoft.Extensions.Configuration;
    using System.Data;
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using IntelliBiz.Models;
    using IntelliBiz.Repositories.Interfaces;

    public class AppointmentRepository : IAppointmentRepository
    {
        private readonly string _connectionString;

        public AppointmentRepository(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // Create Appointment
        public async Task<int> CreateAppointmentAsync(Appointment appointment)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_user_id", appointment.UserId);
                parameters.Add("@p_business_id", appointment.BusinessId);
                parameters.Add("@p_appointment_date", appointment.AppointmentDate);
                parameters.Add("@p_status", appointment.Status);
                parameters.Add("@p_notes", appointment.Notes);

                return await connection.ExecuteAsync("dbo.CreateAppointment", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Delete Appointment
        public async Task<int> DeleteAppointmentAsync(int appointmentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_appointment_id", appointmentId);

                return await connection.ExecuteAsync("dbo.DeleteAppointment", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Read Appointment
        public async Task<Appointment> ReadAppointmentAsync(int appointmentId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_appointment_id", appointmentId);

                return await connection.QuerySingleOrDefaultAsync<Appointment>("dbo.ReadAppointment", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Update Appointment
        public async Task<int> UpdateAppointmentAsync(Appointment appointment)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_appointment_id", appointment.AppointmentId);
                parameters.Add("@p_appointment_date", appointment.AppointmentDate);
                parameters.Add("@p_status", appointment.Status);
                parameters.Add("@p_notes", appointment.Notes);

                return await connection.ExecuteAsync("dbo.UpdateAppointment", parameters, commandType: CommandType.StoredProcedure);
            }
        }

        // Get All Appointments for a Business
        public async Task<IEnumerable<Appointment>> GetAllAppointmentsAsync(int businessId)
        {
            using (var connection = new SqlConnection(_connectionString))
            {
                var parameters = new DynamicParameters();
                parameters.Add("@p_business_id", businessId);

                return await connection.QueryAsync<Appointment>("dbo.GetAllAppointments", parameters, commandType: CommandType.StoredProcedure);
            }
        }
    }

}
