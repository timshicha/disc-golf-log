import db from "../db/db_setup.mjs"

const addCourse = async (userUUID, courseUUID, data) => {
    return await db`INSERT INTO courses (courseuuid, useruuid, data) VALUES (${courseUUID}, ${userUUID}, ${data})`;
}

const modifyCourse = async (userUUID, courseUUID, data) => {
    return await db`UPDATE courses SET data = ${data}
        WHERE useruuid = ${userUUID} AND courseuuid = ${courseUUID}`;
}

export { addCourse, modifyCourse };