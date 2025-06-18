const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const httpRequestEmailCode = async (email) => {
    if(!email) {
        return { success: false, status: 404, error: "Enter an email." };
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/auth/email", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                desired: "code"
            })
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}`);
        }
    } catch (error) {
        console.log(`Could not send code to email: ${error}`);
        if(!result) {
            error = "Could not connect to server.";
        }
        else {
            if(result.status === 500) {
                error = "An error in the server occured.";
            }
            else if(result.status === 404) {
                error = "Bad request to server (not your fault).";
            }
            else {
                error = "An unknown error occured.";
            }
        }
        return {
            success: false,
            error: error,
            status: status
        };
    }
    // If code was sent
    return {
        success: true,
        data: result
    };
}

const httpConfirmEmailCode = async (email, code) => {
    if(!email) {
        return { success: false, status: 400, error: "No email provided." };
    }
    else if(!code) {
        return { success: false, status: 401, error: "No code provided." };
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/auth/email", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                code: code.toString().padStart(6, "0"),
                desired: "login"
            })
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}`);
        }

    } catch (error) {
        console.log(`Could not login: ${error}`);
        if(status === 401) {
            if(result.error) {
                error = result.error;
            }
            else {
                error = "This code is invalid or has expired.";
            }
        }
        else if(status === 400) {
            error = "Bad request to server (blame the programmer!)"
        }
        else {
            error = "Could not connect to server."
        }
        return {
            success: false,
            error: error,
            status: status
        };
    }
    // If code was sent
    return {
        success: true,
        data: await result.json()
    };
}

export { httpRequestEmailCode, httpConfirmEmailCode };