import DataHandler from "../data_handling/data_handler";

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

const uploadQueueToCloud = async () => {
    const email = localStorage.getItem("email");
    if(!email) {
        return { success: false, error: "You are not logged in." };
    }
    try {
        const data = await DataHandler.getQueue();
        if(data.addCourseQueue.length === 0 &&
            data.modifyCourseQueue.length === 0 &&
            data.deleteCourseQueue.length === 0 &&
            data.addRoundQueue.length === 0 &&
            data.modifyRoundQueue.length === 0 &&
            data.deleteRoundQueue.length === 0
        ) {
            localStorage.setItem("last-pushed-to-cloud", Date ());
            return { success: true, data: {}};
        }
        const result = await uploadChangesToCloud(email, data).then(result => result.json());
        await DataHandler.clearUpdateQueue();
        localStorage.setItem("last-pushed-to-cloud", Date ());
        return { success: true, data: result };

    } catch (error) {
        console.log(error)
        return { success: false, error: error };
    }
}

const replaceAllDataInCloud = (userEmail, data) => {
    return fetch(SERVER_URI + "/data", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: userEmail,
            data: data,
            deleteExistingData: true
        })
    });
}

const retrieveAllDataFromCloud = () => {
    return fetch(SERVER_URI + "/data", {
        method: "GET",
        credentials: "include",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export { uploadChangesToCloud, uploadQueueToCloud, replaceAllDataInCloud, retrieveAllDataFromCloud };