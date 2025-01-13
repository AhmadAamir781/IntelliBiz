stateDiagram-v2
    state "Business States" as BS {
        [*] --> PendingApproval
        PendingApproval --> Approved
        PendingApproval --> Rejected
        Approved --> Active
        Active --> Inactive
    }

    state "Appointment States" as AS {
        [*] --> Created
        Created --> Pending
        Pending --> Confirmed
        Pending --> Canceled
        Confirmed --> Completed
    }

    state "Review States" as RS {
        [*] --> Draft
        Draft --> Published
        Published --> Edited
    }