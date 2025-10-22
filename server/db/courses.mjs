import db, { SCHEMA } from "./db_setup.mjs";
import { deleteAllCourseRoundsHard } from "./rounds.mjs";

const addCourse = async (useruuid, courseuuid, data) => {
    const result = await db`INSERT INTO ${SCHEMA}.courses (courseuuid, useruuid, data) VALUES (${courseuuid}, ${useruuid}, ${data})`;
    return result.count > 0;
}

const addCourses = async (courseList) => {
    const result = await db`INSERT INTO ${SCHEMA}.courses
        ${db(courseList, "courseuuid", "useruuid", "data")}
        ON CONFLICT (courseuuid) DO NOTHING
    `;
    console.log("courses added:", result.count);
    return result.count;
}

const modifyCourse = async (useruuid, courseuuid, data) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET data = ${data}
        WHERE useruuid = ${useruuid} AND courseuuid = ${courseuuid}`;
    return result.count > 0;
}

const deleteCourseSoft = async (useruuid, courseuuid) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET deleted = TRUE
        WHERE courseuuid = ${courseuuid} AND useruuid = ${useruuid}`;
    // We can hard delete the rounds because the client will always know
    // there are no rounds for a deleted course.
    await deleteAllCourseRoundsHard(useruuid, courseuuid);
    return result.count > 0;
}

const deleteCourseHard = async (useruuid, courseuuid) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE courseuuid = ${courseuuid} AND useruuid = ${useruuid}`;
    return result.count > 0;
}

const getAllCourses = async (useruuid) => {
    const result = await db`SELECT * FROM ${SCHEMA}.courses WHERE useruuid = ${useruuid} AND deleted = FALSE`;
    return result
}

// Get all courses but only keep the details needed for profile
const getAllCoursesProfile = async (useruuid) => {
    const result = await db`SELECT courseuuid, data->'name' AS name FROM ${SCHEMA}.courses WHERE useruuid = ${useruuid} AND deleted = FALSE`;
    return result;
}

const deleteAllCoursesHard = async (useruuid) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE useruuid = ${useruuid}`;
    return result;
}

const deleteAllCoursesSoft = async (useruuid) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET deleted = TRUE WHERE useruuid = ${useruuid}`;
    return result;
}

const getAllCourseChangesAfterTimestamp = async (useruuid, timestamp) => {
    const result = await db`SELECT * FROM ${SCHEMA}.courses
        WHERE useruuid = ${useruuid} AND modified_at > ${timestamp}`;
    return result;
}

export { addCourse, addCourses, modifyCourse,
    deleteCourseHard, deleteCourseSoft,
    getAllCourses, getAllCoursesProfile,
    deleteAllCoursesHard, deleteAllCoursesSoft,
    getAllCourseChangesAfterTimestamp };