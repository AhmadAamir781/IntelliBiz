use intelliBiz

-- REVIEW Table
CREATE TABLE REVIEW (
    review_id INT IDENTITY(1,1) PRIMARY KEY,
    user_id INT NOT NULL,
    business_id INT NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment NVARCHAR(MAX),
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES [USER](user_id) ON DELETE CASCADE,
    FOREIGN KEY (business_id) REFERENCES BUSINESS(business_id) ON DELETE NO ACTION
);

-- CRUD for REVIEW Table
-- Create Review
Go
CREATE PROCEDURE CreateReview 
    @p_user_id INT,
    @p_business_id INT,
    @p_rating INT,
    @p_comment NVARCHAR(MAX),
    @p_created_at DATETIME
AS
BEGIN
    INSERT INTO REVIEW (user_id, business_id, rating, comment, created_at)
    VALUES (@p_user_id, @p_business_id, @p_rating, @p_comment, @p_created_at);
END
GO

-- Read Review
CREATE PROCEDURE ReadReview 
    @p_review_id INT
AS
BEGIN
    SELECT * FROM REVIEW WHERE review_id = @p_review_id;
END
GO

-- Update Review
CREATE PROCEDURE UpdateReview 
    @p_review_id INT,
    @p_rating INT,
    @p_comment NVARCHAR(MAX)
AS
BEGIN
    UPDATE REVIEW
    SET rating = @p_rating,
        comment = @p_comment
    WHERE review_id = @p_review_id;
END
GO

-- Delete Review
CREATE PROCEDURE DeleteReview 
    @p_review_id INT
AS
BEGIN
    DELETE FROM REVIEW WHERE review_id = @p_review_id;
END
GO

EXEC CreateReview 
    @p_user_id = 1, 
	@p_business_id = 4, 
	@p_rating = '4', 
    @p_comment = 'must recmommended', 
    @p_created_at = '2025-01-03 4:30:00';

EXEC ReadReview @p_review_id = 1;

EXEC UpdateReview 
    @p_review_id = 2, 
    @p_rating = 4, 
    @p_comment = 'worse';
   

EXEC DeleteReview @p_review_id = 1;


Select * from REVIEW