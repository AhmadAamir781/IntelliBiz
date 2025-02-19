```mermaid
classDiagram
    class User {
        +userID: int
        +name: string
        +email: string
        +password: string
        +register()
        +login()
        +logout()
    }

    class Admin {
        +approveBusiness()
        +rejectBusiness()
        +manageUsers()
    }

    class Shopkeeper {
        +registerBusiness()
        +manageBusinessDetails()
    }

    class Customer {
        +searchBusiness()
        +bookAppointment()
        +writeReview()
    }

    class Business {
        +businessID: int
        +name: string
        +category: string
        +status: string
        +registerBusiness()
    }

    class Appointment {
        +appointmentID: int
        +date: Date
        +status: string
        +create()
    }

    class Review {
        +reviewID: int
        +rating: int
        +comment: string
    }

    User <|-- Admin
    User <|-- Shopkeeper
    User <|-- Customer
    Shopkeeper --> Business
    Customer --> Appointment
    Customer --> Review
    Business --> Review
    Business --> Appointment
```

### IntelliBiz Class Diagram
This class diagram represents the main entities in the IntelliBiz platform and their relationships. It helps in understanding the system's architecture and interactions:

- **User** is the base class inherited by `Admin`, `Shopkeeper`, and `Customer`.
- **Admin** can approve or reject business registrations and manage users.
- **Shopkeeper** can register and manage business details.
- **Customer** can search for businesses, book appointments, and write reviews.
- **Business** stores business-related details and is associated with `Review` and `Appointment`.
- **Appointment** represents booking details with customers.
- **Review** contains customer feedback and ratings.

