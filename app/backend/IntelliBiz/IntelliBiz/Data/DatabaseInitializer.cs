using Dapper;
using System.Data;

namespace IntelliBiz.API.Data
{
    public static class DatabaseInitializer
    {
        public static void InitializeDatabase(IDbConnection connection, bool isPostgreSql = false)
        {
            // Create Users table
            string createUsersTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Users (
                        Id SERIAL PRIMARY KEY,
                        FirstName VARCHAR(100) NOT NULL,
                        LastName VARCHAR(100) NOT NULL,
                        Email VARCHAR(100) NOT NULL UNIQUE,
                        PasswordHash VARCHAR(255) NOT NULL,
                        Role VARCHAR(20) NOT NULL,
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UpdatedAt TIMESTAMP NULL
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
                    BEGIN
                        CREATE TABLE Users (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            FirstName NVARCHAR(100) NOT NULL,
                            LastName NVARCHAR(100) NOT NULL,
                            Email NVARCHAR(100) NOT NULL UNIQUE,
                            PasswordHash NVARCHAR(255) NOT NULL,
                            Role NVARCHAR(20) NOT NULL,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NULL
                        );
                    END";

            // Create Settings table
            string createSettingsTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Settings (
                        Id SERIAL PRIMARY KEY,
                        SiteName VARCHAR(100) NOT NULL DEFAULT '',
                        AdminEmail VARCHAR(100) NOT NULL DEFAULT '',
                        SupportEmail VARCHAR(100) NOT NULL DEFAULT '',
                        DefaultCurrency VARCHAR(10) NOT NULL DEFAULT '',
                        TermsOfService TEXT NOT NULL DEFAULT '',
                        PrivacyPolicy TEXT NOT NULL DEFAULT '',
                        UpdatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Settings')
                    BEGIN
                        CREATE TABLE Settings (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            SiteName NVARCHAR(100) NOT NULL DEFAULT '',
                            AdminEmail NVARCHAR(100) NOT NULL DEFAULT '',
                            SupportEmail NVARCHAR(100) NOT NULL DEFAULT '',
                            DefaultCurrency NVARCHAR(10) NOT NULL DEFAULT '',
                            TermsOfService NVARCHAR(MAX) NOT NULL DEFAULT '',
                            PrivacyPolicy NVARCHAR(MAX) NOT NULL DEFAULT '',
                            UpdatedAt DATETIME NOT NULL DEFAULT GETDATE()
                        );
                    END";

            // Create Businesses table
            string createBusinessesTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Businesses (
                        Id SERIAL PRIMARY KEY,
                        OwnerId INT NOT NULL REFERENCES Users(Id),
                        Name VARCHAR(100) NOT NULL,
                        Category VARCHAR(50) NOT NULL,
                        Description TEXT NOT NULL,
                        Address VARCHAR(255) NOT NULL,
                        City VARCHAR(100) NOT NULL,
                        State VARCHAR(50) NOT NULL,
                        ZipCode VARCHAR(20) NOT NULL,
                        Phone VARCHAR(20) NOT NULL,
                        Email VARCHAR(100) NOT NULL,
                        Website VARCHAR(255) NULL,
                        IsVerified BOOLEAN NOT NULL DEFAULT FALSE,
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UpdatedAt TIMESTAMP NULL
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Businesses')
                    BEGIN
                        CREATE TABLE Businesses (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            OwnerId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                            Name NVARCHAR(100) NOT NULL,
                            Category NVARCHAR(50) NOT NULL,
                            Description NVARCHAR(MAX) NOT NULL,
                            Address NVARCHAR(255) NOT NULL,
                            City NVARCHAR(100) NOT NULL,
                            State NVARCHAR(50) NOT NULL,
                            ZipCode NVARCHAR(20) NOT NULL,
                            Phone NVARCHAR(20) NOT NULL,
                            Email NVARCHAR(100) NOT NULL,
                            Website NVARCHAR(255) NULL,
                            IsVerified BIT NOT NULL DEFAULT 0,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NULL
                        );
                    END";

            // Create Services table
            string createServicesTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Services (
                        Id SERIAL PRIMARY KEY,
                        BusinessId INT NOT NULL REFERENCES Businesses(Id),
                        Name VARCHAR(100) NOT NULL,
                        Description TEXT NOT NULL,
                        Price DECIMAL(10, 2) NOT NULL,
                        Duration INT NOT NULL,
                        IsActive BOOLEAN NOT NULL DEFAULT TRUE,
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UpdatedAt TIMESTAMP NULL
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Services')
                    BEGIN
                        CREATE TABLE Services (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            BusinessId INT NOT NULL FOREIGN KEY REFERENCES Businesses(Id),
                            Name NVARCHAR(100) NOT NULL,
                            Description NVARCHAR(MAX) NOT NULL,
                            Price DECIMAL(10, 2) NOT NULL,
                            Duration INT NOT NULL,
                            IsActive BIT NOT NULL DEFAULT 1,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NULL
                        );
                    END";

            // Create Appointments table
            string createAppointmentsTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Appointments (
                        Id SERIAL PRIMARY KEY,
                        UserId INT NOT NULL REFERENCES Users(Id),
                        BusinessId INT NOT NULL REFERENCES Businesses(Id),
                        ServiceId INT NOT NULL REFERENCES Services(Id),
                        AppointmentDate DATE NOT NULL,
                        StartTime TIME NOT NULL,
                        EndTime TIME NOT NULL,
                        Status VARCHAR(20) NOT NULL,
                        Notes TEXT NULL,
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UpdatedAt TIMESTAMP NULL
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Appointments')
                    BEGIN
                        CREATE TABLE Appointments (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                            BusinessId INT NOT NULL FOREIGN KEY REFERENCES Businesses(Id),
                            ServiceId INT NOT NULL FOREIGN KEY REFERENCES Services(Id),
                            AppointmentDate DATE NOT NULL,
                            StartTime TIME NOT NULL,
                            EndTime TIME NOT NULL,
                            Status NVARCHAR(20) NOT NULL,
                            Notes NVARCHAR(MAX) NULL,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NULL
                        );
                    END";

            // Create Reviews table
            string createReviewsTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Reviews (
                        Id SERIAL PRIMARY KEY,
                        UserId INT NOT NULL REFERENCES Users(Id),
                        BusinessId INT NOT NULL REFERENCES Businesses(Id),
                        Rating INT NOT NULL,
                        Comment TEXT NOT NULL,
                        IsFlagged BOOLEAN NOT NULL DEFAULT FALSE,
                        FlagReason TEXT NULL,
                        Status VARCHAR(20) NOT NULL DEFAULT 'published',
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        UpdatedAt TIMESTAMP NULL
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Reviews')
                    BEGIN
                        CREATE TABLE Reviews (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                            BusinessId INT NOT NULL FOREIGN KEY REFERENCES Businesses(Id),
                            Rating INT NOT NULL,
                            Comment NVARCHAR(MAX) NOT NULL,
                            IsFlagged BIT NOT NULL DEFAULT 0,
                            FlagReason NVARCHAR(MAX) NULL,
                            Status NVARCHAR(20) NOT NULL DEFAULT 'published',
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
                            UpdatedAt DATETIME NULL
                        );
                    END";

            // Create Messages table
            string createMessagesTable = isPostgreSql
                ? @"
                    CREATE TABLE IF NOT EXISTS Messages (
                        Id SERIAL PRIMARY KEY,
                        SenderId INT NOT NULL REFERENCES Users(Id),
                        ReceiverId INT NOT NULL REFERENCES Users(Id),
                        Content TEXT NOT NULL,
                        IsRead BOOLEAN NOT NULL DEFAULT FALSE,
                        CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
                    );"
                : @"
                    IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Messages')
                    BEGIN
                        CREATE TABLE Messages (
                            Id INT IDENTITY(1,1) PRIMARY KEY,
                            SenderId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                            ReceiverId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
                            Content NVARCHAR(MAX) NOT NULL,
                            IsRead BIT NOT NULL DEFAULT 0,
                            CreatedAt DATETIME NOT NULL DEFAULT GETDATE()
                        );
                    END";

            // Execute all create table statements
            connection.Execute(createUsersTable);
            connection.Execute(createSettingsTable);
            connection.Execute(createBusinessesTable);
            connection.Execute(createServicesTable);
            connection.Execute(createAppointmentsTable);
            connection.Execute(createReviewsTable);
            connection.Execute(createMessagesTable);
        }
    }
}
