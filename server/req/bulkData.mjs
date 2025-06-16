import { validateToken } from "../auth/tokens.mjs";
import { uploadBulkData, replaceAllCloudData, getAllCloudData } from "../data_handling/bulkData.mjs";

/**
 * @param {import("express").Express} app
 */
export const registerPostDataEndpoint = (app) => {
    // If the user sends a list of modifications
    app.post("/data", async (req, res) => {
        // Validate token
        const user = await validateToken(req.cookies.token);
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        // At this point the user has been validated and we have their userID
        try {
            let updateResults;
            // See if the user wants to delete all existing data
            if(req.body.deleteExistingData) {
                updateResults = await replaceAllCloudData(user, req.body.data);
            }
            else {
                updateResults = await uploadBulkData(user, req.body.data);
            }
            console.log(`${user.email}: Updated: ${updateResults.updatesSucceeded} (${updateResults.updatesFailed} failed)`);
            console.log("Errors: ", updateResults.errors);
            res.status(200).json({
                updatesSucceeded: updateResults.updatesSucceeded,
                updatesFailed: updateResults.updatesFailed,
                errors: updateResults.errors,
                updateQueue: updateResults.data,
                success: true
            });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        } 
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerGetDataEndpoint = (app) => {
    // If the user wants to get all their data from the cloud (such as when logging in)
    app.get("/data", async (req, res) => {
        // Validate token
        const user = await validateToken(req.cookies.token);
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            const result = await getAllCloudData(user);
            res.status(200).json({
                courses: result.courses,
                rounds: result.rounds,
                success: true
            });
        } catch (error) {
            res.status(400).send("Failed to retrieve data from cloud.");
            console.log(error);
        }
    });
}