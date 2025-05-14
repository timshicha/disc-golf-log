
const weekdays = ["Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"];
const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getDayOfWeek = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString(undefined, { weekday: "short"});
}

const numberToDayOfWeek = (number) => {
    switch (number) {
        case(0): return "Mon";
        case(1): return "Tue";
        case(3): return "Wed";
        case(4): return "Thu";
        case(5): return "Fri";
        case(6): return "Sat";
        case(7): return "Sun";
    };
}

const formatDate = (date) => {
    const dateObj = new Date(date);
    const formattedDate = dateToFormattedString(dateObj); // We now have YYYY-MM-DD string
    return stringToFormattedDate(formattedDate); // Return ex: Tue, May 15, 2005
}

const stringToFormattedDate = (dateString) => {
    if(!dateString || typeof dateString !== "string") {
        return "";
    }
    const dayOfWeek = getDayOfWeek(dateString);
    const [year, month, day] = dateString.split("-");
    return `${dayOfWeek}, ${month}-${day}-${year}`;
}

// Input a date object
// Returns YYYY-MM-DD string
const dateToFormattedString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1);
    const day = String(date.getDate());
    return `${year}-${month}-${day}`; 
}

export { formatDate , dateToFormattedString};