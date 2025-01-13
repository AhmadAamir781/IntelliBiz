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

    User <|-- Admin
    User <|-- Shopkeeper
    User <|-- Customer
    Shopkeeper --> Business
    Customer --> Appointment
    Customer --> Review
    Business --> Review
    Business --> Appointment
