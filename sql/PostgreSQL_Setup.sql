-- Create database if it doesn't exist
-- Note: This must be run as a superuser
-- CREATE DATABASE "IntelliBizDb";

-- Connect to the database
--\c "IntelliBizDb";

-- Users Table
CREATE TABLE IF NOT EXISTS "Users" (
    "Id" SERIAL PRIMARY KEY,
    "Username" VARCHAR(50) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "PasswordHash" VARCHAR(512) NOT NULL,
    "FirstName" VARCHAR(50) NOT NULL,
    "LastName" VARCHAR(50) NOT NULL,
    "PhoneNumber" VARCHAR(20) NULL,
    "Role" VARCHAR(20) NOT NULL DEFAULT 'User',
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Email" ON "Users"("Email");
CREATE UNIQUE INDEX IF NOT EXISTS "IX_Users_Username" ON "Users"("Username");

-- Businesses Table
CREATE TABLE IF NOT EXISTS "Businesses" (
    "Id" SERIAL PRIMARY KEY,
    "OwnerId" INTEGER NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT NULL,
    "Category" VARCHAR(50) NULL,
    "Address" VARCHAR(255) NULL,
    "City" VARCHAR(50) NULL,
    "State" VARCHAR(50) NULL,
    "ZipCode" VARCHAR(20) NULL,
    "PhoneNumber" VARCHAR(20) NULL,
    "Email" VARCHAR(100) NULL,
    "Website" VARCHAR(255) NULL,
    "LogoUrl" VARCHAR(255) NULL,
    "CoverImageUrl" VARCHAR(255) NULL,
    "IsVerified" BOOLEAN NOT NULL DEFAULT FALSE,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    "AverageRating" FLOAT NOT NULL DEFAULT 0,
    "ReviewCount" INTEGER NOT NULL DEFAULT 0,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NULL,
    FOREIGN KEY ("OwnerId") REFERENCES "Users"("Id")
);

CREATE INDEX IF NOT EXISTS "IX_Businesses_OwnerId" ON "Businesses"("OwnerId");
CREATE INDEX IF NOT EXISTS "IX_Businesses_Category" ON "Businesses"("Category");
CREATE INDEX IF NOT EXISTS "IX_Businesses_City" ON "Businesses"("City");
CREATE INDEX IF NOT EXISTS "IX_Businesses_State" ON "Businesses"("State");

-- Business Hours Table
CREATE TABLE IF NOT EXISTS "BusinessHours" (
    "Id" SERIAL PRIMARY KEY,
    "BusinessId" INTEGER NOT NULL,
    "DayOfWeek" INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
    "OpenTime" TIME NOT NULL,
    "CloseTime" TIME NOT NULL,
    "IsClosed" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("BusinessId") REFERENCES "Businesses"("Id") ON DELETE CASCADE,
    CONSTRAINT "UQ_BusinessHours_BusinessId_DayOfWeek" UNIQUE ("BusinessId", "DayOfWeek")
);

CREATE INDEX IF NOT EXISTS "IX_BusinessHours_BusinessId" ON "BusinessHours"("BusinessId");

-- Business Services Table
CREATE TABLE IF NOT EXISTS  ON "BusinessHours"("BusinessId");

-- Business Services Table
CREATE TABLE IF NOT EXISTS "BusinessServices" (
    "Id" SERIAL PRIMARY KEY,
    "BusinessId" INTEGER NOT NULL,
    "Name" VARCHAR(100) NOT NULL,
    "Description" TEXT NULL,
    "Price" DECIMAL(18, 2) NOT NULL,
    "DurationMinutes" INTEGER NOT NULL,
    "IsActive" BOOLEAN NOT NULL DEFAULT TRUE,
    FOREIGN KEY ("BusinessId") REFERENCES "Businesses"("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IX_BusinessServices_BusinessId" ON "BusinessServices"("BusinessId");

-- Business Images Table
CREATE TABLE IF NOT EXISTS "BusinessImages" (
    "Id" SERIAL PRIMARY KEY,
    "BusinessId" INTEGER NOT NULL,
    "ImageUrl" VARCHAR(255) NOT NULL,
    "Caption" VARCHAR(255) NULL,
    "IsPrimary" BOOLEAN NOT NULL DEFAULT FALSE,
    FOREIGN KEY ("BusinessId") REFERENCES "Businesses"("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IX_BusinessImages_BusinessId" ON "BusinessImages"("BusinessId");

-- Appointments Table
CREATE TABLE IF NOT EXISTS "Appointments" (
    "Id" SERIAL PRIMARY KEY,
    "BusinessId" INTEGER NOT NULL,
    "UserId" INTEGER NOT NULL,
    "ServiceId" INTEGER NOT NULL,
    "AppointmentDate" DATE NOT NULL,
    "StartTime" TIME NOT NULL,
    "EndTime" TIME NOT NULL,
    "Status" VARCHAR(20) NOT NULL DEFAULT 'Pending',
    "Notes" TEXT NULL,
    "CreatedAt" TIMESTAMP NOT NULL,
    "UpdatedAt" TIMESTAMP NULL,
    FOREIGN KEY ("BusinessId") REFERENCES "Businesses"("Id"),
    FOREIGN KEY ("UserId") REFERENCES "Users"("Id"),
    FOREIGN KEY ("ServiceId") REFERENCES "BusinessServices"("Id")
);

CREATE INDEX IF NOT EXISTS "IX_Appointments_BusinessId" ON "Appointments"("BusinessId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_UserId" ON "Appointments"("UserId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_ServiceId" ON "Appointments"("ServiceId");
CREATE INDEX IF NOT EXISTS "IX_Appointments_AppointmentDate" ON "Appointments"("AppointmentDate");
CREATE INDEX IF NOT EXISTS "IX_Appointments_Status" ON "Appointments"("Status");

-- Messages Table
CREATE TABLE IF NOT EXISTS "Messages" (
    "Id" SERIAL PRIMARY KEY,
    "SenderId" INTEGER NOT NULL,
    "ReceiverId" INTEGER NOT NULL,
    "BusinessId" INTEGER NULL,
    "Content" TEXT NOT NULL,
    "IsRead" BOOLEAN NOT NULL DEFAULT FALSE,
    "CreatedAt" TIMESTAMP NOT NULL,
    FOREIGN KEY ("SenderId") REFERENCES "Users"("Id"),
    FOREIGN KEY ("ReceiverId") REFERENCES "Users"("Id"),
    FOREIGN KEY ("BusinessId") REFERENCES "Businesses"("Id")
);

CREATE INDEX IF NOT EXISTS "IX_Messages_SenderId" ON "Messages"("SenderId");
CREATE INDEX IF NOT EXISTS "IX_Messages_ReceiverId" ON "Messages"("ReceiverId");
CREATE INDEX IF NOT EXISTS "IX_Messages_BusinessId" ON "Messages"("BusinessId");
CREATE INDEX IF NOT EXISTS "IX_Messages_IsRead" ON "Messages"("IsRead");

-- Insert sample data
DO $$
BEGIN
    -- Admin user (password: Admin123!)
    IF NOT EXISTS (SELECT 1 FROM "Users" WHERE "Email" = 'admin@intellibiz.com') THEN
        INSERT INTO "Users" ("Username", "Email", "PasswordHash", "FirstName", "LastName", "PhoneNumber", "Role", "CreatedAt")
        VALUES ('admin', 'admin@intellibiz.com', 'AQAAAAIAAYagAAAAELPZzRk5ScaGgwN3XZ/5Mw0xJaIz/Aw9B9vY/FQEdMKZEMG33vzNkZ1HG/oBdQ==:YourSaltHere', 'Admin', 'User', '555-123-4567', 'Admin', NOW());
    END IF;
END $$;