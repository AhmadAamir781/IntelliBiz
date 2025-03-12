use intelliBiz

-- APPOINTMENT Table
CREATE TABLE APPOINTMENT (
    appointment_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    appointment_date DATETIME NOT NULL,
    status NVARCHAR(50),
    notes NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES [USER](user_id) ON DELETE NO ACTION,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(business_id) ON DELETE CASCADE,
);

-- CRUD for APPOINTMENT Table
-- Create Appointment
GO
CREATE PROCEDURE CreateAppointment 
    @p_user_id INT,
    @p_business_id INT,
    @p_appointment_date DATETIME,
    @p_status NVARCHAR(50),
    @p_notes NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO APPOINTMENT (user_id, business_id, appointment_date, status, notes)
    VALUES (@p_user_id, @p_business_id, @p_appointment_date, @p_status, @p_notes);
END
GO

-- Read Appointment
CREATE PROCEDURE ReadAppointment 
    @p_appointment_id INT
AS
BEGIN
    SELECT * FROM APPOINTMENT WHERE appointment_id = @p_appointment_id;
END
GO

-- Update Appointment
CREATE PROCEDURE UpdateAppointment 
    @p_appointment_id INT,
    @p_appointment_date DATETIME,
    @p_status NVARCHAR(50),
    @p_notes NVARCHAR(MAX)
AS
BEGIN
    UPDATE APPOINTMENT
    SET appointment_date = @p_appointment_date,
        status = @p_status,
        notes = @p_notes
    WHERE appointment_id = @p_appointment_id;
END
GO

-- Delete Appointment
CREATE PROCEDURE DeleteAppointment 
    @p_appointment_id INT
AS
BEGIN
    DELETE FROM APPOINTMENT WHERE appointment_id = @p_appointment_id;
END
GO

EXEC CreateAppointment 
    @p_user_id = 3, 
    @p_business_id = 1,
    @p_appointment_date = '2025-01-03 14:30:00', 
    @p_status = 'Scheduled',
    @p_notes = 'Customer requested a morning slot';


EXEC ReadAppointment @p_appointment_id = 2;


EXEC UpdateAppointment 
    @p_appointment_id = 2, 
    @p_appointment_date = '2025-01-03 14:30:00', 
    @p_status = 'pending', 
    @p_notes = 'Cancel it please';
   

EXEC DeleteAppointment @p_appointment_id = 16;	


select * from [USER]
select * from BUSINESS
select * from APPOINTMENT