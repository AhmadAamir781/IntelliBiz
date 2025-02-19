usecaseDiagram-v2
    actor Admin
    actor User
    actor Shopkeeper as Shopkeeper
    actor Customer as Customer

    Admin --> (Approve/Reject Business)
    Admin --> (Manage Reviews)
    Admin --> (View Appointments)

    User --> (Register/Login)
    User --> (Logout)

    Shopkeeper --> (Register Business)
    Shopkeeper --> (Update Business Details)
    Shopkeeper --> (View Appointments)

    Customer --> (Search Businesses)
    Customer --> (Book Appointment)
    Customer --> (Write Review)
    Customer --> (Cancel Appointment)
