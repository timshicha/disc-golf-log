
const weekdays = ["Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"];
const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Get day of week from iso
const getDayOfWeek = (iso) => {
    const date = new Date(iso);
    return date.toLocaleDateString(undefined, { weekday: "short"});
}

// iso date is format "YYYY-MM-DDTHH:MM"
const parseIso = (iso) => {
    let year;
    let month;
    let date;
    let hour;
    let minute;
    const day = getDayOfWeek(iso);
    let remainingString;

    [year, month, remainingString] = iso.split("-"); // YYYY-MM-DDTHH:MM
    [date, remainingString] = remainingString.split("T");
    if(remainingString) {
        [hour, minute] = remainingString.split(":");
    }
    return {
        year, month, date, hour, minute, day
    };
}

const isoToVisualFormat = (iso) => {
    if(!iso) {
        return "";
    }
    const date = parseIso(iso);
    return `${date.day}, ${date.month}-${date.date}-${date.year}`;
}

export { isoToVisualFormat };