

import { addCourse, addCourses, deleteAllCoursesSoft, deleteCourseSoft, getAllCourses, modifyCourse } from "../db/courses.mjs";
import { addRound, addRounds, deleteRoundSoft, getAllRounds, modifyRound } from "../db/rounds.mjs";
import { isValidCourseName } from "../utils/format.mjs";

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
        const courses = [];
        for (let i = 0; i < data.addCourseQueue.length; i++) {
            // If invalid course name
            const validName = isValidCourseName(data.addCourseQueue[i].name);
            if(!validName.isValid) {
                updatesFailed++;
                errors.push(`Could not add course: ${validName.error}`);
                continue;
            }
            courses.push({
                courseuuid: data.addCourseQueue[i].courseUUID,
                useruuid: user.useruuid,
                data: data.addCourseQueue[i]
            });
        }
        try {
            // If there are courses to add
            if(courses.length > 0) {
                const succeeded = await addCourses(courses);
                updatesSucceeded += succeeded;
                updatesFailed += (courses.length - succeeded);
                console.log("Uploaded " + succeeded + " courses");
            }
        } catch (error) {
            console.log("Uploading list of courses failed:", error);
        }
    }
    // For all courses that are being modified
    if(Array.isArray(data.modifyCourseQueue)) {
        for (let i = 0; i < data.modifyCourseQueue.length; i++) {
            try {
                const validName = isValidCourseName(data.modifyCourseQueue[i].name);
                const courseUUID = data.modifyCourseQueue[i].courseUUID;
                const courseData = data.modifyCourseQueue[i];
                // Validate course name
                if(!validName.isValid) {
                    updatesFailed++;
                    errors.push(`Could not modify course: ${validName.error}`);
                }
                else if(await modifyCourse(user.useruuid, courseUUID, courseData)) {
                    data.modifyCourseQueue[i] = null;
                    updatesSucceeded++;
                }
                else {
                    errors.push("Cound not modify course: Course not found");
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`Could not modify course: ${error}`);
                updatesFailed++;
            }
        }
    }
    // Courses being deleted
    if(Array.isArray(data.deleteCourseQueue)) {
        for (let i = 0; i < data.deleteCourseQueue.length; i++) {
            try {
                const courseUUID = data.deleteCourseQueue[i].courseUUID;
                if(await deleteCourseSoft(user.useruuid, courseUUID)) {
                    data.deleteCourseQueue[i] = null;
                    updatesSucceeded++;
                }
                else {
                    errors.push("Could not delete course: Course not found");
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`Could not delete course: ${error}`);
                updatesFailed++;
            }
        }
    }

    // For all rounds that are being added
    if(Array.isArray(data.addRoundQueue)) {
        const rounds = [];
        for (let i = 0; i < data.addRoundQueue.length; i++) {
            rounds.push({
                courseuuid: data.addRoundQueue[i].courseUUID,
                rounduuid: data.addRoundQueue[i].roundUUID,
                played_at: data.addRoundQueue[i].date,
                data: data.addRoundQueue[i]
            });
        }
        try {
            // If there are rounds to add
            if(rounds.length > 0) {
                const succeeded = await addRounds(rounds);
                updatesSucceeded += succeeded;
                updatesFailed += (rounds.length - succeeded);
                console.log("Uploaded " + succeeded + " rounds");
            }
        } catch (error) {
            console.log("Uploading list of rounds failed:", error);
        }
    }
    // For all rounds that are being modified
    if(Array.isArray(data.modifyRoundQueue)) {
        for (let i = 0; i < data.modifyRoundQueue.length; i++) {
            try {
                const roundUUID = data.modifyRoundQueue[i].roundUUID;
                const playedAt = data.modifyRoundQueue[i].date;
                const roundData = data.modifyRoundQueue[i];
                if(await modifyRound(user.useruuid, roundUUID, playedAt, roundData)) {
                    data.modifyRoundQueue[i] = null;
                    updatesSucceeded++;
                }
                else {
                    errors.push("Could not modify round: Round not found");
                    updatesFailed++;
                }
            } catch (error) {
                errors.push(`Cound not modify round: ${error}`);
                updatesFailed++;
            }
        }
    }
    // Deleting rounds
    if(Array.isArray(data.deleteRoundQueue)) {
        for (let i = 0; i < data.deleteRoundQueue.length; i++) {
            try {
                const roundUUID = data.deleteRoundQueue[i].roundUUID;
                if(await deleteRoundSoft(user.useruuid, roundUUID)) {
                    updatesSucceeded++;
                    data.deleteRoundQueue[i] = null;
                }
                else {
                    errors.push("Could not delete round: Round not found");
                    updatesFailed++;
                }

            } catch (error) {
                errors.push(`Could not delete round: ${error}`);
                updatesFailed++;
            }
        }
    }

    return { data, updatesSucceeded, updatesFailed, errors };
}

const getAllCloudData = async (user) => {
    let courses = await getAllCourses(user.useruuid);
    let rounds = await getAllRounds(user.useruuid);
    
    // Go through each course and round and just keep the data
    courses = courses.map(course => course.data);
    rounds = rounds.map(round => round.data);
    return { courses, rounds };
}

const getAllChangesAfterTimestamp = async (user, timestamp) => {
    // Get all courses that changed after the timestamp
    const courses = await getAllCourseChangesAfterTimestamp(user.useruuid, timestamp);
    const rounds = await getAllRoundChangesAfterTimestamp(user.useruuid, timestamp);
    return { courses, rounds };
}

// Delete all data in the cloud and replace with new data
const replaceAllCloudData = async (user, data) => {
    // Delete all courses (rounds should be deleted through cascading deletion)
    await deleteAllCoursesSoft(user.useruuid);
    return await uploadBulkData(user, data);
}

export { uploadBulkData, getAllCloudData,
    getAllChangesAfterTimestamp, replaceAllCloudData };