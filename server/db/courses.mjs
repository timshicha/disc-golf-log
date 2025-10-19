import db, { SCHEMA } from "./db_setup.mjs";
import { deleteAllCourseRoundsHard } from "./rounds.mjs";

const addCourse = async (userUUID, courseUUID, data) => {
    const result = await db`INSERT INTO ${SCHEMA}.courses (courseuuid, useruuid, data) VALUES (${courseUUID}, ${userUUID}, ${data})`;
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

const modifyCourse = async (userUUID, courseUUID, data) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET data = ${data}
        WHERE useruuid = ${userUUID} AND courseuuid = ${courseUUID}`;
    return result.count > 0;
}

const deleteCourseSoft = async (userUUID, courseUUID) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET deleted = TRUE
        WHERE courseuuid = ${courseUUID} AND useruuid = ${userUUID}`;
    // We can hard delete the rounds because the client will always know
    // there are no rounds for a deleted course.
    await deleteAllCourseRoundsHard(userUUID, courseUUID);
    return result.count > 0;
}

const deleteCourseHard = async (userUUID, courseUUID) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE courseuuid = ${courseUUID} AND useruuid = ${userUUID}`;
    return result.count > 0;
}

const getAllCourses = async (userUUID) => {
    const result = await db`SELECT * FROM ${SCHEMA}.courses WHERE useruuid = ${userUUID} AND deleted = FALSE`;
    return result
}

// Get all courses but only keep the details needed for profile
const getAllCoursesProfile = async (userUUID) => {
    const result = await db`SELECT courseuuid, data->'name' AS name FROM ${SCHEMA}.courses WHERE useruuid = ${userUUID} AND deleted = FALSE`;
    return result;
}

const deleteAllCoursesHard = async (userUUID) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE useruuid = ${userUUID}`;
    return result;
}

const deleteAllCoursesSoft = async (userUUID) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET deleted = TRUE WHERE useruuid = ${userUUID}`;
    return result;
}

export { addCourse, addCourses, modifyCourse,
    deleteCourseHard, deleteCourseSoft,
    getAllCourses, getAllCoursesProfile,
    deleteAllCoursesHard, deleteAllCoursesSoft };