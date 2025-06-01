import db from "../db/db_setup.mjs";

const addRound = async (userUUID, roundUUID, courseUUID, data) => {
    // Make sure this course belongs to this user
    const courseUserUUID = (await db`SELECT useruuid FROM courses WHERE courseuuid = ${courseUUID} LIMIT 1`)?.[0]?.useruuid;
    // If user ID's match, add the round
    if(courseUserUUID === userUUID) {
        return await db`INSERT INTO rounds (rounduuid, courseuuid, data) VALUES (${roundUUID}, ${courseUUID}, ${data})`;
    }
    // If not the right user, return false
    throw("Can't add round to a course that does not belong to this user.");
}

export { addRound };