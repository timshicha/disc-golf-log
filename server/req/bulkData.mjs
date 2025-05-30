

import db from "../db/db_setup.mjs";
import { addCourse } from "./courses.mjs";

// If the user sends a bunch of modifications, go through the lists
// and update their data
const uploadBulkData = async (user, data) => {
    // Make sure body is defined
    if(!data) return null;
    console.log(data);
    let updatesSucceeded = 0;
    let updatesFailed = 0;
    // For all courses that are being added
    if(Array.isArray(data.addCourseQueue)) {
        for (let i = 0; i < data.addCourseQueue.length; i++) {
            try {
                const courseUUID = data.addCourseQueue[i].courseUUID;
                const courseData = JSON.stringify(data.addCourseQueue[i]);
                await addCourse(user.useruuid, courseUUID, courseData);
                updatesSucceeded++;
            } catch (error) {
                console.log(`Could not add course ${data.addCourseQueue[i].name}: ${error}`);
                updatesFailed++;
            }
        }
    }
    return { updatesSucceeded, updatesFailed };
}

export { uploadBulkData };