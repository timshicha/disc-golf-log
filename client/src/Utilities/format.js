
const USERNAME_MAX_LENGTH = 20;
const COURSE_NAME_MAX_LENGTH = 50;

/**
 * @param {string} username
 * @returns {{ isValid: boolean, error: string }}
 */
const isValidUsername = (username) => {
    const result = {
        isValid: false,
        error: ""
    };

    if(!username) {
        result.error = "Username not provided";
    }
    else if(typeof username !== "string") {
        result.error = "Username is not a string"
    }
    else if(username.length > USERNAME_MAX_LENGTH) {
        result.error = `Username cannot be longer than ${USERNAME_MAX_LENGTH} characters`;
    }
    else {
        // See if all characters are valid

        // Assume valid for now
        result.isValid = true;

        // Allow: a-z, A-Z, 0-9, _
        for (let i = 0; i < username.length; i++) {
            const c = username[i];
            // If a-z
            if(c.charCodeAt(0) >= 'a'.charCodeAt(0) && c.charCodeAt(0) <= 'z'.charCodeAt(0)) continue;
            // If A-Z
            if(c.charCodeAt(0) >= 'A'.charCodeAt(0) && c.charCodeAt(0) <= 'Z'.charCodeAt(0)) continue;
            // If 0-9
            if(c.charCodeAt(0) >= '0'.charCodeAt(0) && c.charCodeAt(0) <= '9'.charCodeAt(0)) continue;
            if(c === '_') continue;

            // If none of the above, it's an invalid character
            result.isValid = false;
            result.error = `Invalid character: ${c}`;
            break;
        }
    }
    return result;
}

/**
 * @param {string} courseName
 * @returns {{ isValid: boolean, error: string }}
 */
const isValidCourseName = (courseName) => {
    const result = {
        isValid: false,
        error: ""
    };

    if(!courseName) {
        result.error = "Course name not provided";
    }
    else if(typeof courseName !== "string") {
        result.error = "Course name is not a string"
    }
    else if(courseName.length > COURSE_NAME_MAX_LENGTH) {
        result.error = `Course name cannot be longer than ${COURSE_NAME_MAX_LENGTH} characters`;
    }
    else {
        // See if all characters are valid

        // Assume valid for now
        result.isValid = true;

        // Allow pretty much any character that will show up properly on a screen
        for (let i = 0; i < courseName.length; i++) {
            const c = courseName[i];
            if(c.charCodeAt(0) < 32 || c.charCodeAt(0) > 126) {
                result.isValid = false;
                result.error = `Invalid character: ${c}`;
                break;
            }
        }
    }
    return result;
}


export { isValidUsername, isValidCourseName };