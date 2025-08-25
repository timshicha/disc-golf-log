import DataHandler from "../DataHandling/DataHandler";
import { httpLogout } from "./auth.mjs";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const httpUploadQueueToCloud = async (deleteExistingCloudData=false) => {
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
        const data = await DataHandler.getQueue();
        result = await fetch(SERVER_URI + "/data", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                data: data,
                deleteExistingData: deleteExistingCloudData === true
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
    // If queue was uploaded to cloud, clear it
    await DataHandler.clearUpdateQueue();
    return {
        success: true,
        data: result
    };
}

const httpRetrieveAllDataFromCloud = async () => {
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

export { httpUploadQueueToCloud, httpRetrieveAllDataFromCloud };