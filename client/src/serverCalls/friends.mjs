const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const httpSendFriendRequest = async (sendToUUID) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friends/send_request", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userUUID: sendToUUID
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
        console.log(`Could not send friend request: ${error}`);
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