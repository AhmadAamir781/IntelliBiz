-- Create ChatRooms table
CREATE TABLE ChatRooms (
    ChatRoomId INT IDENTITY(1,1) PRIMARY KEY,
    BusinessId INT NOT NULL,
    UserId INT NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    LastMessageAt DATETIME2,
    CONSTRAINT FK_ChatRooms_Businesses FOREIGN KEY (BusinessId) REFERENCES Businesses(BusinessId),
    CONSTRAINT FK_ChatRooms_Users FOREIGN KEY (UserId) REFERENCES Users(UserId)
);
GO

-- Create ChatMessages table
CREATE TABLE ChatMessages (
    MessageId INT IDENTITY(1,1) PRIMARY KEY,
    ChatRoomId INT NOT NULL,
    SenderId INT NOT NULL,
    Message NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT FK_ChatMessages_ChatRooms FOREIGN KEY (ChatRoomId) REFERENCES ChatRooms(ChatRoomId),
    CONSTRAINT FK_ChatMessages_Users FOREIGN KEY (SenderId) REFERENCES Users(UserId)
);
GO

-- Create stored procedures for chat
CREATE PROCEDURE CreateChatRoom
    @BusinessId INT,
    @UserId INT,
    @ChatRoomId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    -- Check if chat room already exists
    SELECT @ChatRoomId = ChatRoomId
    FROM ChatRooms
    WHERE BusinessId = @BusinessId AND UserId = @UserId;

    IF @ChatRoomId IS NULL
    BEGIN
        INSERT INTO ChatRooms (BusinessId, UserId)
        VALUES (@BusinessId, @UserId);

        SET @ChatRoomId = SCOPE_IDENTITY();
    END
END;
GO

CREATE PROCEDURE GetChatRooms
    @UserId INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        cr.ChatRoomId,
        cr.CreatedAt,
        cr.LastMessageAt,
        b.Name AS BusinessName,
        b.Address AS BusinessAddress,
        u.FirstName + ' ' + u.LastName AS UserName,
        u.Email AS UserEmail
    FROM ChatRooms cr
    JOIN Businesses b ON cr.BusinessId = b.BusinessId
    JOIN Users u ON cr.UserId = u.UserId
    WHERE cr.UserId = @UserId
    ORDER BY cr.LastMessageAt DESC;
END;
GO

CREATE PROCEDURE GetChatMessages
    @ChatRoomId INT,
    @LastMessageId INT = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        cm.MessageId,
        cm.Message,
        cm.CreatedAt,
        u.FirstName + ' ' + u.LastName AS SenderName,
        u.Email AS SenderEmail
    FROM ChatMessages cm
    JOIN Users u ON cm.SenderId = u.UserId
    WHERE cm.ChatRoomId = @ChatRoomId
    AND (@LastMessageId IS NULL OR cm.MessageId > @LastMessageId)
    ORDER BY cm.CreatedAt ASC;
END;
GO

CREATE PROCEDURE SaveChatMessage
    @ChatRoomId INT,
    @SenderId INT,
    @Message NVARCHAR(MAX),
    @MessageId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO ChatMessages (ChatRoomId, SenderId, Message)
    VALUES (@ChatRoomId, @SenderId, @Message);

    SET @MessageId = SCOPE_IDENTITY();

    -- Update LastMessageAt in ChatRooms
    UPDATE ChatRooms
    SET LastMessageAt = GETUTCDATE()
    WHERE ChatRoomId = @ChatRoomId;
END;
GO 