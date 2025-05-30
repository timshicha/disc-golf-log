const SERVER_URI = import.meta.env.VITE_SERVER_URI;

// We don't need any other credentials since the server set an http cookie
// and will use that for the credential
const uploadChangesToCloud = (userEmail, data) => {
    return fetch(SERVER_URI + "/data", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userEmail,
            data: data
        })
    });
}

export { uploadChangesToCloud };