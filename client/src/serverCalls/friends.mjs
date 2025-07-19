const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const httpSendFriendRequest = async (userUUID) => {
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
                userUUID: userUUID
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

export const httpUndoSendFriendRequest = async (userUUID) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friends/undo_send_request", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userUUID: userUUID
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
        console.log(`Could not undo send friend request: ${error}`);
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

export const httpRespondToFriendRequest = async (targetUserUUID, response) => {
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friends/respond_request", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userUUID: targetUserUUID,
                response: response
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
        console.log(`Could not respond to friend request: ${error}`);
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