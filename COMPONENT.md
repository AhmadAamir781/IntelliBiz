graph TD
    Frontend[Frontend-React.js] --> Backend[Backend-ASP.NET Core]
    Backend -->|REST APIs| Database[Database-MS SQL]
    Backend --> ExternalAPI[Map API]
    Backend --> EmailService[Email Notification Service]

    Frontend --> ExternalAPI
    Frontend --> Authentication[Authentication Service]
    Authentication --> Backend
