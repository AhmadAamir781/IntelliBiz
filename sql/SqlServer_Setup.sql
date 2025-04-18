IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'IntelliBizDb')
BEGIN
    CREATE DATABASE IntelliBizDb;
END
GO

USE IntelliBizDb;
GO

-- Users Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Username NVARCHAR(50) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        PasswordHash NVARCHAR(512) NOT NULL,
        FirstName NVARCHAR(50) NOT NULL,
        LastName NVARCHAR(50) NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        Role NVARCHAR(20) NOT NULL DEFAULT 'User',
        CreatedAt DATETIME NOT NULL,
        UpdatedAt DATETIME NULL
    );
    
    CREATE UNIQUE INDEX IX_Users_Email ON Users(Email);
    CREATE UNIQUE INDEX IX_Users_Username ON Users(Username);
END
GO

-- Businesses Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Businesses')
BEGIN
    CREATE TABLE Businesses (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        OwnerId INT NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Category NVARCHAR(50) NULL,
        Address NVARCHAR(255) NULL,
        City NVARCHAR(50) NULL,
        State NVARCHAR(50) NULL,
        ZipCode NVARCHAR(20) NULL,
        PhoneNumber NVARCHAR(20) NULL,
        Email NVARCHAR(100) NULL,
        Website NVARCHAR(255) NULL,
        LogoUrl NVARCHAR(255) NULL,
        CoverImageUrl NVARCHAR(255) NULL,
        IsVerified BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        AverageRating FLOAT NOT NULL DEFAULT 0,
        ReviewCount INT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL,
        UpdatedAt DATETIME NULL,
        FOREIGN KEY (OwnerId) REFERENCES Users(Id)
    );
    
    CREATE INDEX IX_Businesses_OwnerId ON Businesses(OwnerId);
    CREATE INDEX IX_Businesses_Category ON Businesses(Category);
    CREATE INDEX IX_Businesses_City ON Businesses(City);
    CREATE INDEX IX_Businesses_State ON Businesses(State);
END
GO

-- Business Hours Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BusinessHours')
BEGIN
    CREATE TABLE BusinessHours (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BusinessId INT NOT NULL,
        DayOfWeek INT NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
        OpenTime TIME NOT NULL,
        CloseTime TIME NOT NULL,
        IsClosed BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE,
        CONSTRAINT UQ_BusinessHours_BusinessId_DayOfWeek UNIQUE (BusinessId, DayOfWeek)
    );
    
    CREATE INDEX IX_BusinessHours_BusinessId ON BusinessHours(BusinessId);
END
GO

-- Business Services Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BusinessServices')
BEGIN
    CREATE TABLE BusinessServices (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BusinessId INT NOT NULL,
        Name NVARCHAR(100) NOT NULL,
        Description NVARCHAR(MAX) NULL,
        Price DECIMAL(18, 2) NOT NULL,
        DurationMinutes INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_BusinessServices_BusinessId ON BusinessServices(BusinessId);
END
GO

-- Business Images Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'BusinessImages')
BEGIN
    CREATE TABLE BusinessImages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BusinessId INT NOT NULL,
        ImageUrl NVARCHAR(255) NOT NULL,
        Caption NVARCHAR(255) NULL,
        IsPrimary BIT NOT NULL DEFAULT 0,
        FOREIGN KEY (BusinessId) REFERENCES Businesses(Id) ON DELETE CASCADE
    );
    
    CREATE INDEX IX_BusinessImages_BusinessId ON BusinessImages(BusinessId);
END
GO

-- Appointments Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Appointments')
BEGIN
    CREATE TABLE Appointments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        BusinessId INT NOT NULL,
        UserId INT NOT NULL,
        ServiceId INT NOT NULL,
        AppointmentDate DATE NOT NULL,
        StartTime TIME NOT NULL,
        EndTime TIME NOT NULL,
        Status NVARCHAR(20) NOT NULL DEFAULT 'Pending',
        Notes NVARCHAR(MAX) NULL,
        CreatedAt DATETIME NOT NULL,
        UpdatedAt DATETIME NULL,
        FOREIGN KEY (BusinessId) REFERENCES Businesses(Id),
        FOREIGN KEY (UserId) REFERENCES Users(Id),
        FOREIGN KEY (ServiceId) REFERENCES BusinessServices(Id)
    );
    
    CREATE INDEX IX_Appointments_BusinessId ON Appointments(BusinessId);
    CREATE INDEX IX_Appointments_UserId ON Appointments(UserId);
    CREATE INDEX IX_Appointments_ServiceId ON Appointments(ServiceId);
    CREATE INDEX IX_Appointments_AppointmentDate ON Appointments(AppointmentDate);
    CREATE INDEX IX_Appointments_Status ON Appointments(Status);
END
GO

-- Messages Table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Messages')
BEGIN
    CREATE TABLE Messages (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        SenderId INT NOT NULL,
        ReceiverId INT NOT NULL,
        BusinessId INT NULL,
        Content NVARCHAR(MAX) NOT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME NOT NULL,
        FOREIGN KEY (SenderId) REFERENCES Users(Id),
        FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
        FOREIGN KEY (BusinessId) REFERENCES Businesses(Id)
    );
    
    CREATE INDEX IX_Messages_SenderId ON Messages(SenderId);
    CREATE INDEX IX_Messages_ReceiverId ON Messages(ReceiverId);
    CREATE INDEX IX_Messages_BusinessId ON Messages(BusinessId);
    CREATE INDEX IX_Messages_IsRead ON Messages(IsRead);
END
GO

-- Insert sample data
-- Admin user (password: Admin123!)
IF NOT EXISTS (SELECT TOP 1 * FROM Users WHERE Email = 'admin@intellibiz.com')
BEGIN
    INSERT INTO Users (Username, Email, PasswordHash, FirstName, LastName, PhoneNumber, Role, CreatedAt)
    VALUES ('admin', 'admin@intellibiz.com', 'AQAAAAIAAYagAAAAELPZzRk5ScaGgwN3XZ/5Mw0xJaIz/Aw9B9vY/FQEdMKZEMG33vzNkZ1HG/oBdQ==:YourSaltHere', 'Admin', 'User', '555-123-4567', 'Admin', GETUTCDATE());
END
GO