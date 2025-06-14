import db, { SCHEMA } from "./db_setup.mjs";

const addCourse = async (userUUID, courseUUID, data) => {
    const result = await db`INSERT INTO ${SCHEMA}.courses (courseuuid, useruuid, data) VALUES (${courseUUID}, ${userUUID}, ${data})`;
    return result.count > 0;
}

const modifyCourse = async (userUUID, courseUUID, data) => {
    const result = await db`UPDATE ${SCHEMA}.courses SET data = ${data}
        WHERE useruuid = ${userUUID} AND courseuuid = ${courseUUID}`;
    return result.count > 0;
}

const deleteCourse = async (userUUID, courseUUID) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE courseuuid = ${courseUUID} AND useruuid = ${userUUID}`;
    return result.count > 0;
}

const getAllCourses = async (userUUID) => {
    const result = await db`SELECT * FROM ${SCHEMA}.courses WHERE useruuid = ${userUUID}`;
    return result
}

const deleteAllCourses = async (userUUID) => {
    const result = await db`DELETE FROM ${SCHEMA}.courses WHERE useruuid = ${userUUID}`;
    return result;
}

export { addCourse, modifyCourse, deleteCourse, getAllCourses, deleteAllCourses };