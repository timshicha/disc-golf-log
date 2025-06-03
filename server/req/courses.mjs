import db from "../db/db_setup.mjs"

const addCourse = async (userUUID, courseUUID, data) => {
    const result = await db`INSERT INTO courses (courseuuid, useruuid, data) VALUES (${courseUUID}, ${userUUID}, ${data})`;
    return result.count > 0;
}

const modifyCourse = async (userUUID, courseUUID, data) => {
    const result = await db`UPDATE courses SET data = ${data}
        WHERE useruuid = ${userUUID} AND courseuuid = ${courseUUID}`;
    return result.count > 0;
}

const deleteCourse = async (userUUID, courseUUID) => {
    const result = await db`DELETE FROM courses WHERE courseuuid = ${courseUUID} AND useruuid = ${userUUID}`;
    return result.count > 0;
}

export { addCourse, modifyCourse, deleteCourse };