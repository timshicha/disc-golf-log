

// If the user sends a bunch of modifications, go through the lists

import db from "../db/db_setup.mjs";

// and update their data
const consumeBulkData = async (userID, data) => {
    // Make sure body is defined
    if(!data) return null;
    let updatesUploaded = 0;
    console.log(data);
    // For all courses that are being added
    if(Array.isArray(data.addCourseQueue)) {
        for (let i = 0; i < data.addCourseQueue.length; i++) {
            try {
                const name = data.addCourseQueue[i].name;
                const holes = data.addCourseQueue[i].holes;
                await db`INSERT INTO courses (user_id, name, holes) VALUES
                    (${userID}, ${name}, ${holes})`;
                updatesUploaded++;
            } catch (error) {
                console.log(`Could not add course ${data.addCourseQueue[i].name}: ${error}`);
            }
        }
    }
    return updatesUploaded;
}

export { consumeBulkData };