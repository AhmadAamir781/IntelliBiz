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

### Clone & Setup

```bash
git clone https://github.com/your-username/intellibiz.git
cd IntelliBiz

### Backend Setup
cd IntelliBiz
dotnet restore
dotnet run

### FrontEnd Setup
cd IntelliBiz
npm install --legacy-peer-deps
npm run dev


### 📃 License
This project is created for academic and demonstration purposes. All rights reserved to the respective contributors.
