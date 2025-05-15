
// -1 is first string comes first
// 0 if same
// 1 if second string comes first
const compareStrings = (string1, string2) => {
    if(string1 < string2) return -1;
    if(string1 === string2) return 0;
    return 1;
}

// -1 if first date comes first or if it's null
// 0 if same
// 1 if the second date comes first (or if first is null)
const compareDates = (date1, date2) => {
    if(!date1 || date1 < date2) return -1;
    if(date1 === date2) return 0;
    return 1;
}

export { compareStrings, compareDates };