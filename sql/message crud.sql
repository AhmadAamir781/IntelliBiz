use intelliBiz



CREATE TABLE MESSAGE (
    message_id INT IDENTITY(1,1) PRIMARY KEY,
    chat_id INT NOT NULL,
    sender_id INT NOT NULL,
    content NVARCHAR(MAX) NOT NULL,
    sent_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (chat_id) REFERENCES CHAT(chat_id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES [USER](user_id) 
);


CREATE PROCEDURE CreateMessage 
    @p_chat_id INT,
    @p_sender_id INT,
    @p_content NVARCHAR(MAX)
AS
BEGIN
    INSERT INTO MESSAGE (chat_id, sender_id, content)
    VALUES (@p_chat_id, @p_sender_id, @p_content);
END
GO


CREATE PROCEDURE ReadMessage 
    @p_message_id INT
AS
BEGIN
    SELECT * 
    FROM MESSAGE
    WHERE message_id = @p_message_id;
END
GO


CREATE PROCEDURE UpdateMessage 
    @p_message_id INT,
    @p_content NVARCHAR(MAX),
    @p_sent_at DATETIME = NULL
AS
BEGIN
    UPDATE MESSAGE
    SET content = @p_content,
        sent_at = ISNULL(@p_sent_at, sent_at) 
    WHERE message_id = @p_message_id;
END
GO


CREATE PROCEDURE DeleteMessage 
    @p_message_id INT
AS
BEGIN
    DELETE FROM MESSAGE
    WHERE message_id = @p_message_id;
END
GO


EXEC CreateMessage 
    @p_chat_id = 1,
    @p_sender_id = 2,
    @p_content = 'iafnksfbksbfksbfkssfsfls';


EXEC ReadMessage 
    @p_message_id = 1;


EXEC UpdateMessage 
    @p_message_id = 1,
    @p_content = 'Updated message content',
    @p_sent_at = NULL;


EXEC DeleteMessage 
    @p_message_id = 1;
