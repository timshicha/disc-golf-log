
const weekdays = ["Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday"];
const weekdaysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
const monthsShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const dateToString = (date) => {
    if(!date) {
        return "";
    }
    return `${weekdaysShort[date.getDay()]}, ${date.getMonth() + 1}-${date.getDate()}-${date.getFullYear()}`;
}

export { dateToString };