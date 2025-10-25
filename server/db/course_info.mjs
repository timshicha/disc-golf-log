import db, { SCHEMA } from "./db_setup.mjs";

const findCourseInfoByCourseUUID = async (uuid) => {
    const result = await db`SELECT * FROM ${SCHEMA}.course_info WHERE uuid = ${uuid}`;
    return result?.[0];
}

const findCoursesInfoByPartialName = async (name) => {
    const result = await db`SELECT uuid, name, city FROM ${SCHEMA}.course_info WHERE name ILIKE ${'%' + name + '%'} LIMIT 10`;
    return result;
}

export { findCourseInfoByCourseUUID,
    findCoursesInfoByPartialName
}