use intelliBiz
-- Table Creation
CREATE TABLE CHAT (
    chat_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    initiated_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES [USER](user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(business_id) ON DELETE No action,
);
Go
-- Create Procedure
CREATE PROCEDURE CreateChat 
    @p_user_id INT,
    @p_business_id INT,
    @p_initiated_at DATETIME = NULL
AS
BEGIN
    INSERT INTO CHAT (user_id, business_id, initiated_at)
    VALUES (@p_user_id, @p_business_id, ISNULL(@p_initiated_at, GETDATE()));
END
GO

-- Read Procedure
CREATE PROCEDURE ReadChat 
    @p_chat_id INT
AS
BEGIN
    SELECT * 
    FROM CHAT
    WHERE chat_id = @p_chat_id;
END
GO

-- Update Procedure
CREATE PROCEDURE UpdateChat 
    @p_chat_id INT,
    @p_initiated_at DATETIME
AS
BEGIN
    UPDATE CHAT
    SET initiated_at = @p_initiated_at
    WHERE chat_id = @p_chat_id;
END
GO

-- Delete Procedure
CREATE PROCEDURE DeleteChat 
    @p_chat_id INT
AS
BEGIN
    DELETE FROM CHAT
    WHERE chat_id = @p_chat_id;
END
GO

-- Example Execution for Procedures

-- Insert a new chat
EXEC CreateChat 
    @p_user_id = 3,             -- Replace with relevant user_id
    @p_business_id = 5,         -- Replace with relevant business_id
    @p_initiated_at = '2025-01-05 14:30:00';     -- Defaults to current date/time if NULL

-- Retrieve a chat
EXEC ReadChat 
    @p_chat_id = 1;             -- Replace with relevant chat_id

-- Update an existing chat
EXEC UpdateChat 
    @p_chat_id = 1,             -- Replace with relevant chat_id
    @p_initiated_at = '2025-01-05 14:30:00'; -- Replace with the desired datetime

-- Delete a chat
EXEC DeleteChat 
    @p_chat_id = 1;             -- Replace with relevant chat_id

select * from CHAT
select * from BUSINESS
select * from [USER]
select * from APPOINTMENT
select * from REVIEW