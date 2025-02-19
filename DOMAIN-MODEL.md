```mermaid
classDiagram
    class User {
        +userID: int
        +name: string
        +email: string
        +password: string
        +role: string
        +register()
        +login()
        +logout()
    }

    class Business {
        +businessID: int
        +name: string
        +category: string
        +address: string
        +status: string
        +registerBusiness()
        +updateDetails()
    }

    class Appointment {
        +appointmentID: int
        +date: Date
        +time: string
        +status: string
        +createAppointment()
        +cancelAppointment()
    }

    class Review {
        +reviewID: int
        +rating: int
        +comment: string
        +date: Date
        +addReview()
        +editReview()
    }

    class Admin {
        +adminID: int
        +approveBusiness()
        +rejectBusiness()
        +viewAppointments()
        +manageReviews()
    }

    User <|-- Admin
    User ||--o{ Business
    User ||--o{ Appointment
    User ||--o{ Review
    Business ||--o{ Appointment
    Business ||--o{ Review
```

### IntelliBiz Domain Model Diagram
This domain model diagram provides a high-level overview of the IntelliBiz system, depicting key entities and their relationships:

- **User**: A general entity representing system users, including customers and shopkeepers.
- **Admin**: A specialized user with additional privileges to approve/reject businesses and manage appointments/reviews.
- **Business**: Represents businesses that users can register and manage.
- **Appointment**: Captures details of scheduled appointments between customers and businesses.
- **Review**: Stores customer feedback and ratings related to businesses.


