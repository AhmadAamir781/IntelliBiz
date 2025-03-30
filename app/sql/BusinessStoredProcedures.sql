-- Ensure the Businesses table exists before creating procedures
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Businesses]') AND type in (N'U'))
BEGIN
     CREATE TABLE [dbo].[Businesses](
        [Id] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Category] [nvarchar](50) NOT NULL,
        [Owner] [nvarchar](100) NOT NULL,
        [Location] [nvarchar](200) NOT NULL,
        [Status] [nvarchar](20) NOT NULL DEFAULT 'pending',
        [RegistrationDate] [datetime] NOT NULL DEFAULT GETDATE(),
        [Verified] [bit] NOT NULL DEFAULT 0,
        [IsDeleted] [bit] NOT NULL DEFAULT 0,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Businesses] PRIMARY KEY CLUSTERED ([Id] ASC)
    );
END
GO

-- sp_GetBusinesses
CREATE OR ALTER PROCEDURE [dbo].[sp_GetBusinesses]
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Name, Category, Owner, Location, Status, RegistrationDate, Verified
    FROM Businesses
    WHERE IsDeleted = 0
    ORDER BY CreatedAt DESC;
END
GO

-- sp_GetBusinessById
CREATE OR ALTER PROCEDURE [dbo].[sp_GetBusinessById]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    SELECT Id, Name, Category, Owner, Location, Status, RegistrationDate, Verified
    FROM Businesses
    WHERE Id = @Id AND IsDeleted = 0;
END
GO

-- sp_AddBusiness
CREATE OR ALTER PROCEDURE [dbo].[sp_AddBusiness]
    @Name NVARCHAR(100),
    @Category NVARCHAR(50),
    @Owner NVARCHAR(100),
    @Location NVARCHAR(200),
    @Status NVARCHAR(20) = 'pending',
    @Verified BIT = 0,
    @Id INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO Businesses (Name, Category, Owner, Location, Status, Verified)
    VALUES (@Name, @Category, @Owner, @Location, @Status, @Verified);
    
    SET @Id = SCOPE_IDENTITY();
END
GO

-- sp_UpdateBusiness
CREATE OR ALTER PROCEDURE [dbo].[sp_UpdateBusiness]
    @Id INT,
    @Name NVARCHAR(100),
    @Category NVARCHAR(50),
    @Owner NVARCHAR(100),
    @Location NVARCHAR(200),
    @Status NVARCHAR(20),
    @Verified BIT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Businesses
    SET Name = @Name,
        Category = @Category,
        Owner = @Owner,
        Location = @Location,
        Status = @Status,
        Verified = @Verified,
        UpdatedAt = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO

-- sp_DeleteBusiness
CREATE OR ALTER PROCEDURE [dbo].[sp_DeleteBusiness]
    @Id INT
AS
BEGIN
    SET NOCOUNT ON;
    
    UPDATE Businesses
    SET IsDeleted = 1,
        UpdatedAt = GETDATE()
    WHERE Id = @Id AND IsDeleted = 0;
END
GO
