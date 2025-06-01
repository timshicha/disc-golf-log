

import db from "../db/db_setup.mjs";
import { addCourse } from "./courses.mjs";
import { addRound } from "./rounds.mjs";

// If the user sends a bunch of modifications, go through the lists
// and update their data
const uploadBulkData = async (user, data) => {
    // Make sure body is defined
    if(!data) return null;
    let updatesSucceeded = 0;
    let updatesFailed = 0;
    let errors = [];
    // For all courses that are being added
    if(Array.isArray(data.addCourseQueue)) {
        for (let i = 0; i < data.addCourseQueue.length; i++) {
            try {
                const courseUUID = data.addCourseQueue[i].courseUUID;
                const courseData = JSON.stringify(data.addCourseQueue[i]);
                if(await addCourse(user.useruuid, courseUUID, courseData)) {
                    updatesSucceeded++
                }
                else {
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`Could not add course ${data.addCourseQueue[i].name}: ${error}`);
                updatesFailed++;
            }
        }
    }
    // For all rounds that are being added
    if(Array.isArray(data.addRoundQueue)) {
        for (let i = 0; i < data.addRoundQueue.length; i++) {
            try {
                const roundUUID = data.addRoundQueue[i].roundUUID;
                const courseUUID = data.addRoundQueue[i].courseUUID;
                const roundData = JSON.stringify(data.addRoundQueue[i]);
                if(await addRound(user.useruuid, roundUUID, courseUUID, roundData)) {
                    updatesSucceeded++;
                }
                else {
                    updatesFailed++;
                }
                
            } catch (error) {
                errors.push(`Could not add round ${data.addRoundQueue[i].roundUUID}: ${error}`);
                updatesFailed++;
            }
        }
    }
    return { updatesSucceeded, updatesFailed, errors };
}

export { uploadBulkData };