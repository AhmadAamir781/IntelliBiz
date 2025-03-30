-- Author: System
-- Created: 2024-03-18
-- Description: Stored procedures for user and authentication operations

USE IntelliBiz;
GO

-- GetUserByAuth0Id
-- Description: Retrieves user information by Auth0 ID
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[GetUserByAuth0Id]
    @Auth0Id NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        UserId,
        Email,
        FirstName,
        LastName,
        Role,
        CreatedAt,
        UpdatedAt
    FROM Users
    WHERE Auth0Id = @Auth0Id;
END
GO

-- CreateUser
-- Description: Creates a new user
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[CreateUser]
    @Email NVARCHAR(100),
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Auth0Id NVARCHAR(100),
    @Role NVARCHAR(20),
    @UserId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO Users (Email, FirstName, LastName, Auth0Id, Role)
        VALUES (@Email, @FirstName, @LastName, @Auth0Id, @Role);
        
        SET @UserId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- UpdateUser
-- Description: Updates user information
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[UpdateUser]
    @UserId INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @Email NVARCHAR(100)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE Users
        SET 
            FirstName = @FirstName,
            LastName = @LastName,
            Email = @Email,
            UpdatedAt = GETDATE()
        WHERE UserId = @UserId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- GetUserBusinesses
-- Description: Retrieves all businesses owned by a user
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[GetUserBusinesses]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        b.BusinessId,
        b.Name,
        b.Description,
        b.Address,
        b.Phone,
        b.Rating,
        b.ReviewCount,
        b.IsVerified,
        c.Name AS CategoryName,
        c.Icon AS CategoryIcon,
        (SELECT TOP 1 ImageUrl 
         FROM BusinessImages 
         WHERE BusinessId = b.BusinessId 
         ORDER BY IsMain DESC, CreatedAt DESC) AS MainImage
    FROM Businesses b
    INNER JOIN Categories c ON b.CategoryId = c.CategoryId
    WHERE b.CreatedBy = @UserId
    ORDER BY b.CreatedAt DESC;
END
GO

-- GetUserReviews
-- Description: Retrieves all reviews made by a user
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[GetUserReviews]
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        r.ReviewId,
        r.Rating,
        r.Comment,
        r.CreatedAt,
        b.BusinessId,
        b.Name AS BusinessName,
        c.Name AS CategoryName
    FROM Reviews r
    INNER JOIN Businesses b ON r.BusinessId = b.BusinessId
    INNER JOIN Categories c ON b.CategoryId = c.CategoryId
    WHERE r.UserId = @UserId
    ORDER BY r.CreatedAt DESC;
END
GO 