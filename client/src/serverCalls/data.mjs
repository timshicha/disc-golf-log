import DataHandler from "../DataHandling/DataHandler";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const uploadQueueToCloud = async (email, deleteExistingCloudData=false) => {
    if(!email) {
        return { success: false, error: "You are not logged in." };
    }
    let result;
    let status;
    try {
        const data = await DataHandler.getQueue();
        result = await fetch(SERVER_URI + "/data", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                data: data,
                deleteExistingData: deleteExistingCloudData
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
        console.log(`Could not upload queue to cloud: ${error}`);
        return {
            success: false,
            error: error,
            status: status
        };
    }
    // If queue was uploaded to cloud
    console.log(result);
    return {
        success: true,
        data: result
    };
}

const retrieveAllDataFromCloud = async (email) => {
    if(!email) {
        return { success: false, error: "You are not logged in." };
    }
    let result;
    let status;
    try {
        result = await fetch(SERVER_URI + "/data", {
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
        console.log(`Could not retrieve data from cloud: ${error}`);
        return {
            success: false,
            error: error,
            status: status
        };
    }
    console.log(result);
    await DataHandler.bulkAdd(result.courses, result.rounds);
    return {
        success: true,
        data: result
    };
}

export { uploadQueueToCloud, retrieveAllDataFromCloud };