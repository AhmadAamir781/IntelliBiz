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

    User ||--|{ Business
    User||--|{ Appointment
    User ||--|{ Review
    Business ||--|{ Appointment
    Business ||--|{ Review
