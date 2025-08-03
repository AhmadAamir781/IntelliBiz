# IntelliBiz: Discover, Connect & Thrive with AI

**IntelliBiz** is a smart local business discovery platform that connects users with nearby services through intelligent search, honest reviews, and real-time availability. Designed to empower small businesses, it allows them to manage their digital presence and engage directly with customers.

## 🚀 Features

- 🔍 AI-powered business search with distance filters (5, 10, 20 km)
- 📋 Business profiles with working hours, contact info, WhatsApp, and photo gallery
- 💬 Review system with moderation: approve, reject, flag/unflag
- 🔐 Secure role-based access: Admin, User, Shopkeeper
- 🌐 Google login via Auth0 authentication
- 📡 RESTful APIs with JWT-based auth
- 📦 RabbitMQ integration for asynchronous operations
- 💻 Modern UI with React.js, Tailwind CSS, and Bootstrap

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, Bootstrap
- **Backend:** ASP.NET Core Web API, Entity Framework Core, Dapper
- **Authentication:** Auth0, JWT, Google Login
- **Database:** Microsoft SQL Server
- **Messaging Queue:** RabbitMQ

## 🧑‍💼 Roles

- **Admin:** Manage users, reviews, and business data
- **Shopkeeper:** Control and update their business listings
- **User:** Search businesses, post reviews, explore listings

## 📁 Project Structure (Backend)

/IntelliBiz.API
├── Controllers
├── Services
├── Repositories
├── Models
├── DTOs
├── Middleware
└── Utilities


## ⚙️ Getting Started

### Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/)
- [Node.js & npm](https://nodejs.org/)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/)
- [RabbitMQ Server](https://www.rabbitmq.com/download.html)
- [Auth0 Account](https://auth0.com/)

### Backend Setup

cd IntelliBiz
dotnet restore
dotnet run

### FrontEnd Setup
cd IntelliBiz
npm install --legacy-peer-deps
npm run dev

## Swagger UI
<img width="1679" height="1002" alt="image" src="https://github.com/user-attachments/assets/1159ac1a-7f22-4b4c-bcc7-2c11baeb5e66" />

## IntelliBiz UI
<img width="1680" height="919" alt="{2FED7DF0-E0E5-4665-BC8E-420052B70E56}" src="https://github.com/user-attachments/assets/7597a013-db7a-473f-9854-5c2a40b64e87" />
