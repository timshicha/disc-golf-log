

import { addCourse, deleteCourse, getAllCourses, modifyCourse } from "./courses.mjs";
import { addRound, deleteRound, getAllRounds, modifyRound } from "./rounds.mjs";

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
                    data.addCourseQueue[i] = null;
                    updatesSucceeded++
                }
                else {
                    updatesFailed++;
                    errors.push("Could not add course: A course with this ID already exists");
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
                if(await deleteCourse(user.useruuid, courseUUID)) {
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
        for (let i = 0; i < data.addRoundQueue.length; i++) {
            try {
                const roundUUID = data.addRoundQueue[i].roundUUID;
                const courseUUID = data.addRoundQueue[i].courseUUID;
                const roundData = JSON.stringify(data.addRoundQueue[i]);
                if(await addRound(user.useruuid, roundUUID, courseUUID, roundData)) {
                    data.addRoundQueue[i] = null;
                    updatesSucceeded++;
                }
                else {
                    errors.push("Could not add round: (Likely issue) User does not have a course with the provided course ID");
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
                if(await modifyRound(user.useruuid, roundUUID, roundData)) {
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
                if(await deleteRound(user.useruuid, roundUUID)) {
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

export { uploadBulkData, getAllCloudData };