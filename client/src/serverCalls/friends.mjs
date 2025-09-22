import { httpLogout } from "./auth.mjs";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

export const httpSendFriendRequest = async (userUUID) => {
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
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
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
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
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
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

export const httpGetAllFriends = async () => {
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friends", {
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
        console.log(`Could not get all friends: ${error}`);
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

export const httpGetAllFriendRequests = async () => {
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friend_requests", {
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
        console.log(`Could not get all friend requests: ${error}`);
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

export const httpGetFriendRequestCount = async () => {
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friend_request_count", {
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
        console.log(`Could not get friend request count: ${error}`);
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

export const httpRemoveFriend = async (userUUID) => {
    // If user logged out while offline, logout first
    if(localStorage.getItem("logout")) {
        if(!(await httpLogout()).success) {
            return {
                success: false,
                error: "A connection to server could not be established."
            };
        }
        localStorage.clear("logout");
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/friends/remove_friend", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userUUID: userUUID,
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
        console.log(`Could not remove friend: ${error}`);
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