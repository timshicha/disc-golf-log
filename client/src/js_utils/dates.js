
const weekdays = ["Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"];
const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Pad a number with 0's in the beginning
const padNumber = (number, length) => {
    return String(number).padStart(length, "0");
}

// Get day of week from iso
const getDayOfWeek = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { weekday: "short"});
}

// Give an iso in bad format (like to padded 0's) and get
// a properly formatted iso date back
const getSafeIso = (iso) => {
    try {
        let year;
        let month;
        let date;
        let hour;
        let minute;
        let second;
        let remainingString;
    
        [year, month, remainingString] = iso.split("-"); // YYYY-MM-DDTHH:MM
        [date, remainingString] = remainingString.split("T");
        if(remainingString) {
            [hour, remainingString] = remainingString.split(":");
        }
        if(remainingString) {
            [minute, second] = remainingString.split(":");
        }
    
        // Pad the numbers with 0's where necessary
        year = padNumber(year || 1, 4);
        month = padNumber(month || 1, 2);
        date = padNumber(date || 1, 2);
        hour = padNumber(hour || 0, 2);
        minute = padNumber(minute || 0, 2);
        second = padNumber(second || 0, 2);
        
        return `${year}-${month}-${date}T${hour}:${minute}:${second}`;
    } catch (error) {
        // God forbid something breaks, just return a date in valid format so
        // the entire app doesn't crash
        return `1776-07-04T00:00:00`;
    }
}

// iso date is format "YYYY-MM-DDTHH:MM"
const parseIso = (iso) => {
    let year;
    let month;
    let date;
    let hour;
    let minute;
    let second;
    let remainingString;

    [year, month, remainingString] = iso.split("-"); // YYYY-MM-DDTHH:MM
    [date, remainingString] = remainingString.split("T");
    if(remainingString) {
        [hour, remainingString] = remainingString.split(":");
    }
    if(remainingString) {
        [minute, second] = remainingString.split(":");
    }

    // Pad the numbers with 0's where necessary
    year = padNumber(year || 1, 4);
    month = padNumber(month || 1, 2);
    date = padNumber(date || 1, 2);
    hour = padNumber(hour || 0, 2);
    minute = padNumber(minute || 0, 2);
    second = padNumber(second || 0, 2);
    
    const safeIso = `${year}-${month}-${date}T${hour}:${minute}:${second}`;
    const day = getDayOfWeek(safeIso);
    return {
        year, month, date, hour, minute, day
    };
}

// Converts a date to local iso time string
const toLocalIsoString = (date = new Date()) => {    
    const year = padNumber(date.getFullYear(), 4);
    const month = padNumber(date.getMonth() + 1, 2);
    const day = padNumber(date.getDate(), 2);
    const hours = padNumber(date.getHours(), 2);
    const minutes = padNumber(date.getMinutes(), 2);
    const seconds = padNumber(date.getSeconds(), 2);
    
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
}

const isoToVisualFormat = (iso) => {
    if(!iso) {
        return "";
    }
    const date = parseIso(iso);
    return `${date.day}, ${date.month}-${date.date}-${date.year}`;
}

// Turns a date into a time ago string
// Ex: 34 seconds ago
// Ex: 5 minutes ago
// Ex: 16 hours ago
// Ex: May 12, 2025
const timeAgo = (date) => {
    const now = new Date();
    const then = new Date(date);
    const secondsAgo = (now - then) / 1000;
    if(secondsAgo < 5) return "just now";
    if(secondsAgo < 60) return Math.floor(secondsAgo) + " seconds ago";
    const minutesAgo = Math.floor(secondsAgo / 60);
    if(minutesAgo === 1) return "1 minute ago";
    if(minutesAgo < 60) return minutesAgo + " minutes ago";
    const hoursAgo = Math.floor(minutesAgo / 60);
    if(hoursAgo === 1) return "1 hour ago";
    if(hoursAgo < 24) return hoursAgo + " hours ago";
    // Otherwise just do the date
    const year = then.getFullYear();
    const month = monthsShort[then.getMonth()];
    const day = then.getDate();
    return `on ${month} ${day}, ${year}`;
}

export { getSafeIso, isoToVisualFormat, toLocalIsoString, timeAgo };