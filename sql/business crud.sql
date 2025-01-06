use intelliBiz

CREATE TABLE BUSINESS (
    business_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    name NVARCHAR(255) NOT NULL,
    description NVARCHAR(MAX),
    category NVARCHAR(100),
    contact_number NVARCHAR(20),
    whatsapp NVARCHAR(20),
    address NVARCHAR(MAX),
    business_hours NVARCHAR(MAX),
    photos NVARCHAR(MAX),
    FOREIGN KEY (user_id) REFERENCES [USER](user_id) ON DELETE CASCADE
);

-- CRUD for BUSINESS Table
-- Create Business
Go
CREATE PROCEDURE CreateBusiness 
    @p_user_id INT,
    @p_name NVARCHAR(255),
    @p_description NVARCHAR(MAX),
    @p_category NVARCHAR(100),
    @p_contact_number NVARCHAR(20),
    @p_whatsapp NVARCHAR(20),
    @p_address NVARCHAR(MAX),
    @p_business_hours NVARCHAR(MAX),
    @p_photos NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO BUSINESS (user_id, name, description, category, contact_number, whatsapp, address, business_hours, photos)
    VALUES (@p_user_id, @p_name, @p_description, @p_category, @p_contact_number, @p_whatsapp, @p_address, @p_business_hours, @p_photos);
END

   
GO

-- Read Business
CREATE PROCEDURE ReadBusiness 
    @p_business_id INT
AS
BEGIN
    SELECT * FROM BUSINESS WHERE business_id = @p_business_id;
END
GO

-- Update Business
CREATE PROCEDURE UpdateBusiness 
    @p_business_id INT,
    @p_name NVARCHAR(255),
    @p_description NVARCHAR(MAX),
    @p_category NVARCHAR(100),
    @p_contact_number NVARCHAR(20),
    @p_whatsapp NVARCHAR(20),
    @p_address NVARCHAR(MAX),
    @p_business_hours NVARCHAR(MAX),
    @p_photos NVARCHAR(MAX)
AS
BEGIN
    UPDATE BUSINESS
    SET name = @p_name,
        description = @p_description,
        category = @p_category,
        contact_number = @p_contact_number,
        whatsapp = @p_whatsapp,
        address = @p_address,
        business_hours = @p_business_hours,
        photos = @p_photos
    WHERE business_id = @p_business_id;
END
GO

-- Delete Business
CREATE PROCEDURE DeleteBusiness 
    @p_business_id INT
AS
BEGIN
    DELETE FROM BUSINESS WHERE business_id = @p_business_id;
END
GO


SELECT * from [USER]


SELECT * FROM BUSINESS

EXEC CreateBusiness 
    @p_user_id = '5', 
    @p_name = 'asadTextiles', 
    @p_description = 'Clothhes seller and buyer', 
    @p_category = 'fashion', 
    @p_contact_number = '789456123', 
    @p_whatsapp = '789456123',
	@p_address = 'lahore',
    @p_business_hours = '9 to 5',
	@p_photos = ''

EXEC ReadBusiness @p_business_id = 1;

EXEC UpdateBusiness 
    @p_business_id = 2, 
    @p_name = 'John Updated', 
    @p_description = 'john.updated@example.com', 
    @p_category = 'newpassword123', 
    @p_contact_number = '987-654-3210', 
    @p_whatsapp = '456 New St, Springfield', 
    @p_address = 'islambad',
	@p_business_hours= '5 to 3',
	@p_photos = ''

EXEC DeleteBusiness @p_business_id = 1;
