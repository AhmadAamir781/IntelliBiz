create database intelliBiz

use intelliBiz

CREATE TABLE [USER] (
    user_id INT IDENTITY(1,1) PRIMARY KEY,
    name NVARCHAR(255) NOT NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    password NVARCHAR(255) NOT NULL,
    phone NVARCHAR(20),
    address NVARCHAR(MAX),
    role NVARCHAR(50) NOT NULL CHECK (role IN ('customer', 'shopkeeper', 'admin'))
);
Go
CREATE PROCEDURE CreateUser 
    @p_name NVARCHAR(255),
    @p_email NVARCHAR(255),
    @p_password NVARCHAR(255),
    @p_phone NVARCHAR(20),
    @p_address NVARCHAR(MAX),
    @p_role NVARCHAR(50)
AS
BEGIN
    INSERT INTO [USER] (name, email, password, phone, address, role)
    VALUES (@p_name, @p_email, @p_password, @p_phone, @p_address, @p_role);
END
GO



-- Read User
Go
CREATE PROCEDURE ReadUser 
    @p_user_id INT
AS
BEGIN
    SELECT * FROM [USER] WHERE user_id = @p_user_id;
END
GO

-- Update User
GO
CREATE PROCEDURE UpdateUser 
    @p_user_id INT,
    @p_name NVARCHAR(255),
    @p_email NVARCHAR(255),
    @p_password NVARCHAR(255),
    @p_phone NVARCHAR(20),
    @p_address NVARCHAR(MAX),
    @p_role NVARCHAR(50)
AS
BEGIN
    UPDATE [USER]
    SET name = @p_name,
        email = @p_email,
        password = @p_password,
        phone = @p_phone,
        address = @p_address,
        role = @p_role
    WHERE user_id = @p_user_id;
END


GO

-- Delete User
CREATE PROCEDURE DeleteUser 
    @p_user_id INT
AS
BEGIN
    DELETE FROM [USER] WHERE user_id = @p_user_id;
END


GO


EXEC CreateUser 
    @p_name = 'Asad', 
    @p_email = 'asad@gmail.com', 
    @p_password = 'password123', 
    @p_phone = '123-456-7890', 
    @p_address = 'Mexico', 
    @p_role = 'shopkeeper';

EXEC ReadUser @p_user_id = 1;


EXEC UpdateUser 
    @p_user_id = 14, 
    @p_name = 'John Updated', 
    @p_email = 'john.updated@example.com', 
    @p_password = 'newpassword123', 
    @p_phone = '987-654-3210', 
    @p_address = '456 New St, Springfield', 
    @p_role = 'admin';

EXEC DeleteUser @p_user_id = 3;
select * from [USER]

