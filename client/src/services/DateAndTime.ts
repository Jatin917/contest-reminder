export function convertToISTFormatted(utcDateTime: string): string {
    const date = new Date(utcDateTime);
  
    // Convert UTC time to IST manually (UTC +5:30)
    date.setMinutes(date.getMinutes() + 330);
  
    // Extract components
    const day = date.getDate();
    const month = date.toLocaleString("en-IN", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    
    // Get AM/PM format
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHour = hours % 12 || 12; // Convert 24-hour format to 12-hour
  
    // Add suffix to day (st, nd, rd, th)
    const daySuffix = getDaySuffix(day);
  
    return `${day}${daySuffix} ${month} ${year} at ${formattedHour}${minutes ? ":" + String(minutes).padStart(2, "0") : ""} ${period}`;
  }
  
  // Function to get the correct day suffix
  function getDaySuffix(day: number): string {
    if (day >= 11 && day <= 13) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  export function secondsToHoursMinutes(seconds: number): string {
    const hours = Math.floor(seconds / 3600); // Get whole hours
    const minutes = Math.floor((seconds % 3600) / 60); // Get remaining minutes
  
    return `${hours}h ${minutes}m`;
  }