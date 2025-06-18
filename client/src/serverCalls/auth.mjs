const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const httpSendCodeToEmail = async (email) => {
    if(!email) {
        return { success: false, error: "Enter an email."};
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
                email: email
            })
        });
        if(!result.ok) {
            status = result.status;
            throw new Error(`HTTP request failed with status ${result.status}`);
        }
        else {
            result = await result.json();
        }

    } catch (error) {
        console.log(`Could not upload queue to cloud: ${error}`);
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


export { httpSendCodeToEmail };