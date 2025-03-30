-- Author: System
-- Created: 2024-03-18
-- Description: Creates the IntelliBiz database and initial tables

-- Create Database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'IntelliBiz')
BEGIN
    CREATE DATABASE IntelliBiz;
END
GO

USE IntelliBiz;
GO

-- Create Users Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Users]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Users](
        [UserId] [int] IDENTITY(1,1) NOT NULL,
        [Email] [nvarchar](100) NOT NULL,
        [FirstName] [nvarchar](50) NOT NULL,
        [LastName] [nvarchar](50) NOT NULL,
        [Password] [nvarchar](50) NOT NULL,
        [Auth0Id] [nvarchar](100) NOT NULL,
        [Role] [nvarchar](20) NOT NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED ([UserId] ASC),
        CONSTRAINT [UQ_Users_Email] UNIQUE NONCLUSTERED ([Email] ASC),
        CONSTRAINT [UQ_Users_Auth0Id] UNIQUE NONCLUSTERED ([Auth0Id] ASC)
    );
END
GO

-- Create Categories Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Categories]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Categories](
        [CategoryId] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](50) NOT NULL,
        [Description] [nvarchar](500) NULL,
        [Icon] [nvarchar](50) NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Categories] PRIMARY KEY CLUSTERED ([CategoryId] ASC)
    );
END
GO

-- Create Businesses Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Businesses]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Businesses](
        [BusinessId] [int] IDENTITY(1,1) NOT NULL,
        [Name] [nvarchar](100) NOT NULL,
        [Description] [nvarchar](1000) NOT NULL,
        [CategoryId] [int] NOT NULL,
        [Address] [nvarchar](200) NOT NULL,
        [Phone] [nvarchar](20) NOT NULL,
        [Email] [nvarchar](100) NOT NULL,
        [Website] [nvarchar](200) NULL,
        [Rating] [decimal](2,1) NULL DEFAULT 0,
        [ReviewCount] [int] NULL DEFAULT 0,
        [IsVerified] [bit] NOT NULL DEFAULT 0,
        [CreatedBy] [int] NOT NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Businesses] PRIMARY KEY CLUSTERED ([BusinessId] ASC),
        CONSTRAINT [FK_Businesses_Categories] FOREIGN KEY([CategoryId]) REFERENCES [dbo].[Categories] ([CategoryId]),
        CONSTRAINT [FK_Businesses_Users] FOREIGN KEY([CreatedBy]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Create BusinessImages Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BusinessImages]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BusinessImages](
        [ImageId] [int] IDENTITY(1,1) NOT NULL,
        [BusinessId] [int] NOT NULL,
        [ImageUrl] [nvarchar](500) NOT NULL,
        [IsMain] [bit] NOT NULL DEFAULT 0,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_BusinessImages] PRIMARY KEY CLUSTERED ([ImageId] ASC),
        CONSTRAINT [FK_BusinessImages_Businesses] FOREIGN KEY([BusinessId]) REFERENCES [dbo].[Businesses] ([BusinessId])
    );
END
GO

-- Create Reviews Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[Reviews]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[Reviews](
        [ReviewId] [int] IDENTITY(1,1) NOT NULL,
        [BusinessId] [int] NOT NULL,
        [UserId] [int] NOT NULL,
        [Rating] [int] NOT NULL,
        [Comment] [nvarchar](1000) NULL,
        [CreatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        [UpdatedAt] [datetime] NOT NULL DEFAULT GETDATE(),
        CONSTRAINT [PK_Reviews] PRIMARY KEY CLUSTERED ([ReviewId] ASC),
        CONSTRAINT [FK_Reviews_Businesses] FOREIGN KEY([BusinessId]) REFERENCES [dbo].[Businesses] ([BusinessId]),
        CONSTRAINT [FK_Reviews_Users] FOREIGN KEY([UserId]) REFERENCES [dbo].[Users] ([UserId])
    );
END
GO

-- Create BusinessHours Table
IF NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[BusinessHours]') AND type in (N'U'))
BEGIN
    CREATE TABLE [dbo].[BusinessHours](
        [BusinessHoursId] [int] IDENTITY(1,1) NOT NULL,
        [BusinessId] [int] NOT NULL,
        [DayOfWeek] [int] NOT NULL,
        [OpenTime] [time] NOT NULL,
        [CloseTime] [time] NOT NULL,
        [IsClosed] [bit] NOT NULL DEFAULT 0,
        CONSTRAINT [PK_BusinessHours] PRIMARY KEY CLUSTERED ([BusinessHoursId] ASC),
        CONSTRAINT [FK_BusinessHours_Businesses] FOREIGN KEY([BusinessId]) REFERENCES [dbo].[Businesses] ([BusinessId])
    );
END
GO

-- Insert Sample Data
INSERT INTO [dbo].[Categories] ([Name], [Description], [Icon])
VALUES 
('Plumbing', 'Professional plumbing services', 'fa-wrench'),
('Electrical', 'Electrical services and repairs', 'fa-bolt'),
('Landscaping', 'Landscaping and garden services', 'fa-leaf'),
('Cleaning', 'Professional cleaning services', 'fa-broom'),
('HVAC', 'Heating, ventilation, and air conditioning', 'fa-wind');
GO

-- Insert Sample Users (Auth0 IDs are placeholders)
INSERT INTO [dbo].[Users] ([Email], [FirstName], [LastName], [Auth0Id], [Role])
VALUES 
('admin@intellibiz.com', 'Admin', 'User', 'auth0|admin123', 'Admin'),
('business@intellibiz.com', 'Business', 'Owner', 'auth0|business123', 'BusinessOwner'),
('customer@intellibiz.com', 'Customer', 'User', 'auth0|customer123', 'Customer');
GO 