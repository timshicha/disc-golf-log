import db, { SCHEMA } from "./db_setup.mjs";

const findCourseInfoByCourseUUID = async (uuid) => {
    const result = await db`SELECT * FROM ${SCHEMA}.course_info WHERE uuid = ${uuid}`;
    return result?.[0];
}

export { findCourseInfoByCourseUUID}