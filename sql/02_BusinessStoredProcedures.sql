-- Author: System
-- Created: 2024-03-18
-- Description: Stored procedures for business operations

USE IntelliBiz;
GO

-- GetFeaturedBusinesses
-- Description: Retrieves featured businesses with their details
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[GetFeaturedBusinesses]
    @TopCount INT = 6
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopCount)
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
    WHERE b.IsVerified = 1
    ORDER BY b.Rating DESC, b.ReviewCount DESC;
END
GO

-- GetBusinessDetails
-- Description: Retrieves detailed information about a specific business
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[GetBusinessDetails]
    @BusinessId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Get business basic info
    SELECT 
        b.BusinessId,
        b.Name,
        b.Description,
        b.Address,
        b.Phone,
        b.Email,
        b.Website,
        b.Rating,
        b.ReviewCount,
        b.IsVerified,
        c.Name AS CategoryName,
        c.Icon AS CategoryIcon,
        u.FirstName AS OwnerFirstName,
        u.LastName AS OwnerLastName
    FROM Businesses b
    INNER JOIN Categories c ON b.CategoryId = c.CategoryId
    INNER JOIN Users u ON b.CreatedBy = u.UserId
    WHERE b.BusinessId = @BusinessId;

    -- Get business images
    SELECT 
        ImageId,
        ImageUrl,
        IsMain
    FROM BusinessImages
    WHERE BusinessId = @BusinessId
    ORDER BY IsMain DESC, CreatedAt DESC;

    -- Get business hours
    SELECT 
        DayOfWeek,
        OpenTime,
        CloseTime,
        IsClosed
    FROM BusinessHours
    WHERE BusinessId = @BusinessId
    ORDER BY DayOfWeek;

    -- Get reviews
    SELECT 
        r.ReviewId,
        r.Rating,
        r.Comment,
        r.CreatedAt,
        u.FirstName,
        u.LastName
    FROM Reviews r
    INNER JOIN Users u ON r.UserId = u.UserId
    WHERE r.BusinessId = @BusinessId
    ORDER BY r.CreatedAt DESC;
END
GO

-- CreateBusiness
-- Description: Creates a new business
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[CreateBusiness]
    @Name NVARCHAR(100),
    @Description NVARCHAR(1000),
    @CategoryId INT,
    @Address NVARCHAR(200),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Website NVARCHAR(200),
    @CreatedBy INT,
    @BusinessId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO Businesses (
            Name, Description, CategoryId, Address, Phone, 
            Email, Website, CreatedBy
        )
        VALUES (
            @Name, @Description, @CategoryId, @Address, @Phone,
            @Email, @Website, @CreatedBy
        );
        
        SET @BusinessId = SCOPE_IDENTITY();
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- UpdateBusiness
-- Description: Updates an existing business
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[UpdateBusiness]
    @BusinessId INT,
    @Name NVARCHAR(100),
    @Description NVARCHAR(1000),
    @CategoryId INT,
    @Address NVARCHAR(200),
    @Phone NVARCHAR(20),
    @Email NVARCHAR(100),
    @Website NVARCHAR(200)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        UPDATE Businesses
        SET 
            Name = @Name,
            Description = @Description,
            CategoryId = @CategoryId,
            Address = @Address,
            Phone = @Phone,
            Email = @Email,
            Website = @Website,
            UpdatedAt = GETDATE()
        WHERE BusinessId = @BusinessId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- AddBusinessImage
-- Description: Adds a new image to a business
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[AddBusinessImage]
    @BusinessId INT,
    @ImageUrl NVARCHAR(500),
    @IsMain BIT = 0
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        IF @IsMain = 1
        BEGIN
            UPDATE BusinessImages
            SET IsMain = 0
            WHERE BusinessId = @BusinessId;
        END
        
        INSERT INTO BusinessImages (BusinessId, ImageUrl, IsMain)
        VALUES (@BusinessId, @ImageUrl, @IsMain);
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO

-- AddBusinessReview
-- Description: Adds a new review to a business
-- Author: System
-- Created: 2024-03-18
-- Updated: 2024-03-18
CREATE OR ALTER PROCEDURE [dbo].[AddBusinessReview]
    @BusinessId INT,
    @UserId INT,
    @Rating INT,
    @Comment NVARCHAR(1000)
AS
BEGIN
    SET NOCOUNT ON;
    
    BEGIN TRY
        BEGIN TRANSACTION;
        
        INSERT INTO Reviews (BusinessId, UserId, Rating, Comment)
        VALUES (@BusinessId, @UserId, @Rating, @Comment);
        
        -- Update business rating and review count
        UPDATE Businesses
        SET 
            Rating = (
                SELECT AVG(CAST(Rating AS DECIMAL(2,1)))
                FROM Reviews
                WHERE BusinessId = @BusinessId
            ),
            ReviewCount = (
                SELECT COUNT(*)
                FROM Reviews
                WHERE BusinessId = @BusinessId
            ),
            UpdatedAt = GETDATE()
        WHERE BusinessId = @BusinessId;
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END
GO 