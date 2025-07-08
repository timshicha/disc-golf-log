import db, { SCHEMA } from "./db_setup.mjs";

const addRound = async (userUUID, roundUUID, courseUUID, playedAt, data) => {
    // Make sure this course belongs to this user
    const courseUserUUID = (await db`SELECT useruuid FROM ${SCHEMA}.courses WHERE courseuuid = ${courseUUID} LIMIT 1`)?.[0]?.useruuid;
    // If user ID's match, add the round
    if(courseUserUUID === userUUID) {
        const result = await db`INSERT INTO ${SCHEMA}.rounds (rounduuid, courseuuid, played_at, data) VALUES (${roundUUID}, ${courseUUID}, ${playedAt}, ${data})`;
        return result.count > 0;
    }
    // If not the right user, return false
    return false;
}

const modifyRound = async (userUUID, roundUUID, playedAt, data) => {
    // Make sure this round belongs to this user. Do this by getting the course ID of this round,
    // and then seeing if the user ID of that course is this user's ID.
    const roundUserUUID = (await db`SELECT useruuid FROM ${SCHEMA}.courses WHERE courseuuid =
        (SELECT courseuuid FROM ${SCHEMA}.rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        const result = await db`UPDATE ${SCHEMA}.rounds SET
            data = ${data}, playedAt = ${playedAt}
            WHERE rounduuid = ${roundUUID}`;
        return result.count > 0;
    }
    return false;
}

const deleteRound = async (userUUID, roundUUID) => {
    // Make sure this round belongs to this user by seeing if the corresponding course belongs
    // to this user.
    const roundUserUUID = (await db`SELECT useruuid FROM ${SCHEMA}.courses WHERE courseuuid =
        (SELECT courseuuid FROM ${SCHEMA}.rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        const result = await db`DELETE FROM ${SCHEMA}.rounds WHERE rounduuid = ${roundUUID}`;
        return result.count > 0;
    }
    return false;
}

const getAllRounds = async (userUUID) => {
    const result = await db`SELECT r.* FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID}`;
    return result;
}

const deleteAllRounds = async (userUUID) => {
    const result = await db`SELECT r.* FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID}`;
    return result;
}

const getAllCourseRounds = async (courseUUID) => {
    const result = await db`SELECT data FROM ${SCHEMA}.rounds WHERE courseuuid = ${courseUUID}`;
    return result.map(round => round.data);
}

const getUserRoundsCount = async (userUUID) => {
    const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID}`;
    return parseInt(result?.count || 0);
}

const getMostRecentRounds = async (userUUID, numberOfRounds=3) => {
    const result = await db`SELECT c.data->'name' AS name, r.data->'score' AS score, r.played_at as played_at FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID}
        ORDER BY played_at DESC LIMIT ${numberOfRounds}`;
    return result;
}


export { addRound, modifyRound, deleteRound, getAllRounds, deleteAllRounds, getAllCourseRounds, getUserRoundsCount, getMostRecentRounds };