
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
    // Convert dates to dates
    date1 = new Date(date1);
    date2 = new Date(date2);
    if(!date1 || date1 < date2) return -1;
    if(date1 === date2) return 0;
    return 1;
}

// See if a version is behind the compare-to-version.
// Ex: 1.0.4, 1.0.6 => true, because 1.0.4 < 1.0.6
const isVersionBehind = (version, compareToVersion) => {
    if(!compareToVersion) {
        return false;
    }
    // If just current version is behind, technically it's behind
    if(!version) {
        return true;
    }
    const [vMajor, vMinor, vPatch] = String(version).split(".").map(Number);
    const [cvMajor, cvMinor, cvPatch] = String(compareToVersion).split(".").map(Number);

    // If version is ahead, return false
    if(vMajor > cvMajor) return false;
    if(vMajor < cvMajor) return true;
    if(vMinor > cvMinor) return false;
    if(vMinor < cvMinor) return true;
    if(vPatch >= cvPatch) return false;
    return true;
}

export { compareStrings, compareDates, isVersionBehind };