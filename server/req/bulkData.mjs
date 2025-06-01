

import db from "../db/db_setup.mjs";
import { addCourse, modifyCourse } from "./courses.mjs";
import { addRound, modifyRound } from "./rounds.mjs";

// If the user sends a bunch of modifications, go through the lists
// and update their data
const uploadBulkData = async (user, data) => {
    // Make sure body is defined and is an object
    if(!data || typeof data !== 'object') return null;
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
                errors.push(`Could not add course: ${error}`);
                updatesFailed++;
            }
        }
    }
    // For all courses that are being modified
    if(Array.isArray(data.modifyCourseQueue)) {
        for (let i = 0; i < data.modifyCourseQueue.length; i++) {
            try {
                const courseUUID = data.modifyCourseQueue[i].courseUUID;
                const courseData = JSON.stringify(data.modifyCourseQueue[i]);
                if(await modifyCourse(user.useruuid, courseUUID, courseData)) {
                    updatesSucceeded++;
                }
                else {
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`Could not modify course: ${error}`);
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
                errors.push(`Could not add round: ${error}`);
                updatesFailed++;
            }
        }
    }

    // For all rounds that are being modified
    if(Array.isArray(data.modifyRoundQueue)) {
        for (let i = 0; i < data.modifyRoundQueue.length; i++) {
            try {
                const roundUUID = data.modifyRoundQueue[i].roundUUID;
                const roundData = JSON.stringify(data.modifyRoundQueue[i]);
                if(modifyRound(user.useruuid, roundUUID, roundData)) {
                    updatesSucceeded++;
                }
                else {
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`"Cound not modify round: ${error}`);
                updatesFailed++;
            }
        }
    }
    return { updatesSucceeded, updatesFailed, errors };
}

export { uploadBulkData };