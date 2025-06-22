import DataHandler from "../DataHandling/DataHandler";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const httpChangeUsername = async (newUsername) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/username", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                newUsername: newUsername
            })
        });
        if(!result.ok) {
            status = result.status;
            result = await result.json();
            throw new Error(`HTTP request failed with status ${result.status}.`);
        }
        else {
            result = await result.json();
        }
    } catch (error) {
        console.log(`Could not change username: ${result.error}`);
        return {
            success: false,
            error: result.error,
            status: status
        };
    }
    // If queue was uploaded to cloud, clear it
    return {
        success: true
    };
}

export { httpChangeUsername };