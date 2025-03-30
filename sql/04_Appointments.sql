-- Drop existing stored procedures if they exist
IF OBJECT_ID('UpdateAppointmentStatus', 'P') IS NOT NULL
    DROP PROCEDURE UpdateAppointmentStatus;
GO

IF OBJECT_ID('GetUserAppointments', 'P') IS NOT NULL
    DROP PROCEDURE GetUserAppointments;
GO

IF OBJECT_ID('GetBusinessAppointments', 'P') IS NOT NULL
    DROP PROCEDURE GetBusinessAppointments;
GO

IF OBJECT_ID('CreateAppointment', 'P') IS NOT NULL
    DROP PROCEDURE CreateAppointment;
GO

-- Drop existing table if it exists
IF OBJECT_ID('Appointments', 'U') IS NOT NULL
    DROP TABLE Appointments;
GO

-- Create Appointments table
CREATE TABLE Appointments (
    AppointmentId INT IDENTITY(1,1) PRIMARY KEY,
    BusinessId INT NOT NULL,
    UserId INT NOT NULL,
    AppointmentDate DATE NOT NULL,
    AppointmentTime TIME NOT NULL,
    Status NVARCHAR(20) NOT NULL DEFAULT 'Pending', -- Pending, Confirmed, Cancelled, Completed
    Notes NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    UpdatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_Appointments_Businesses FOREIGN KEY (BusinessId) REFERENCES Businesses(BusinessId),
    CONSTRAINT FK_Appointments_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Create stored procedures for appointments
CREATE PROCEDURE CreateAppointment
    @BusinessId INT,
    @UserId INT,
    @AppointmentDate DATE,
    @AppointmentTime TIME,
    @Notes NVARCHAR(500),
    @AppointmentId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if the time slot is available
    IF EXISTS (
        SELECT 1 FROM Appointments
        WHERE BusinessId = @BusinessId
        AND AppointmentDate = @AppointmentDate
        AND AppointmentTime = @AppointmentTime
        AND Status != 'Cancelled'
    )
    BEGIN
        THROW 50000, 'This time slot is already booked.', 1;
    END

    INSERT INTO Appointments (BusinessId, UserId, AppointmentDate, AppointmentTime, Notes)
    VALUES (@BusinessId, @UserId, @AppointmentDate, @AppointmentTime, @Notes);

    SET @AppointmentId = SCOPE_IDENTITY();
END;
GO

CREATE PROCEDURE GetBusinessAppointments
    @BusinessId INT,
    @StartDate DATE,
    @EndDate DATE
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.AppointmentId,
        a.AppointmentDate,
        a.AppointmentTime,
        a.Status,
        a.Notes,
        a.CreatedAt,
        a.UpdatedAt,
        u.FirstName + ' ' + u.LastName AS UserName,
        u.Email AS UserEmail
    FROM Appointments a
    JOIN Users u ON a.UserId = u.UserId
    WHERE a.BusinessId = @BusinessId
    AND a.AppointmentDate BETWEEN @StartDate AND @EndDate
    ORDER BY a.AppointmentDate, a.AppointmentTime;
END;
GO

CREATE PROCEDURE GetUserAppointments
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        a.AppointmentId,
        a.AppointmentDate,
        a.AppointmentTime,
        a.Status,
        a.Notes,
        a.CreatedAt,
        a.UpdatedAt,
        b.Name AS BusinessName,
        b.Address AS BusinessAddress
    FROM Appointments a
    JOIN Businesses b ON a.BusinessId = b.BusinessId
    WHERE a.UserId = @UserId
    ORDER BY a.AppointmentDate, a.AppointmentTime;
END;
GO

CREATE PROCEDURE UpdateAppointmentStatus
    @AppointmentId INT,
    @Status NVARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE Appointments
    SET Status = @Status,
        UpdatedAt = GETUTCDATE()
    WHERE AppointmentId = @AppointmentId;
END;
GO 