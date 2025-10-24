const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const httpLookupCourseInfoByUUID = async (uuid) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/course-info/" + uuid, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}.`);
        }
        else {
            result = await result.json();
        }
    } catch (error) {
        console.log(`Could not get course info: ${error}`);
        return {
            success: false,
            error: error,
            status: status
        };
    }
    return {
        success: true,
        data: result
    };
}

export const httpLookupCoursesInfoByPartialName = async (name) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/course-lookup/" + name, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}.`);
        }
        else {
            result = await result.json();
        }
    } catch (error) {
        console.log(`Could not get course info: ${error}`);
        return {
            success: false,
            error: error,
            status: status
        };
    }
    return {
        success: true,
        data: result
    };
}