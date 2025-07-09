
const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const httpGetUserProfile = async (username) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/profile/" + username, {
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
        console.log(`Could not get profile: ${error}`);
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

const httpGetUserCourse = async (username, courseUUID) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/course/" + courseUUID, {
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
        console.log(`Could not get profile: ${error}`);
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

const httpUpdateProfileVisibility = async (publicProfile) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/settings/public_profile", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                public_profile: publicProfile
            })
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}.`);
        }
        else {
            result = await result.json();
        }
    } catch (error) {
        console.log(`Could not update profile visibility: ${error}`);
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

export { httpGetUserProfile, httpGetUserCourse, httpUpdateProfileVisibility };