interface BusinessHoursProps {
  hours?: {
    monday?: { open: string; close: string }
    tuesday?: { open: string; close: string }
    wednesday?: { open: string; close: string }
    thursday?: { open: string; close: string }
    friday?: { open: string; close: string }
    saturday?: { open: string; close: string }
    sunday?: { open: string; close: string }
  }
}

export function BusinessHours({ hours = {} }: BusinessHoursProps) {
  const formatTime = (time: string) => {
    if (!time) return ""

    try {
      const [hours, minutes] = time.split(":")
      const hour = Number.parseInt(hours, 10)
      const suffix = hour >= 12 ? "PM" : "AM"
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
      return `${displayHour}:${minutes} ${suffix}`
    } catch (error) {
      return time
    }
  }

  // Default empty object for all days
  const emptyDay = { open: "", close: "" };

  const days = [
    { name: "Monday", data: hours?.monday || emptyDay },
    { name: "Tuesday", data: hours?.tuesday || emptyDay },
    { name: "Wednesday", data: hours?.wednesday || emptyDay },
    { name: "Thursday", data: hours?.thursday || emptyDay },
    { name: "Friday", data: hours?.friday || emptyDay },
    { name: "Saturday", data: hours?.saturday || emptyDay },
    { name: "Sunday", data: hours?.sunday || emptyDay },
  ]

  // Get current day of week (0 = Sunday, 1 = Monday, etc.)
  const today = new Date().getDay()
  // Convert to our array index (0 = Monday, 6 = Sunday)
  const todayIndex = today === 0 ? 6 : today - 1

  return (
    <div className="space-y-2">
      {days.map((day, index) => (
        <div key={day.name} className={`flex justify-between py-1 ${index === todayIndex ? "font-medium" : ""}`}>
          <span className={index === todayIndex ? "text-primary" : ""}>
            {day.name}
            {index === todayIndex && " (Today)"}
          </span>
          <span>
            {day.data.open && day.data.close
              ? `${formatTime(day.data.open)} - ${formatTime(day.data.close)}`
              : "Closed"}
          </span>
        </div>
      ))}
    </div>
  )
}
