import db from "../db/db_setup.mjs"

const addCourse = (userUUID, courseUUID, data) => {
    return db`INSERT INTO courses (courseuuid, useruuid, data) VALUES (${courseUUID}, ${userUUID}, ${data})`;
}

const modifyCourse = (userUUID, courseUUID, data) => {
    return db`UPDATE courses SET data = ${data}
        WHERE useruuid = ${userUUID} AND courseuuid = ${courseUUID}`;
}

export { addCourse, modifyCourse };