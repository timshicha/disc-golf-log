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

const addRounds = async (roundList) => {
    const result = await db`INSERT INTO ${SCHEMA}.rounds
        ${db(roundList, "courseuuid", "rounduuid", "played_at", "data")}
        ON CONFLICT (rounduuid) DO NOTHING
    `;
    console.log("rounds added:", result.count);
    return result.count;
}

const modifyRound = async (userUUID, roundUUID, playedAt, data) => {
    // Make sure this round belongs to this user. Do this by getting the course ID of this round,
    // and then seeing if the user ID of that course is this user's ID.
    const roundUserUUID = (await db`SELECT useruuid FROM ${SCHEMA}.courses WHERE courseuuid =
        (SELECT courseuuid FROM ${SCHEMA}.rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        const result = await db`UPDATE ${SCHEMA}.rounds SET
            data = ${data}, played_at = ${playedAt}
            WHERE rounduuid = ${roundUUID}`;
        return result.count > 0;
    }
    return false;
}

const deleteRoundHard = async (userUUID, roundUUID) => {
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

const deleteRoundSoft = async (userUUID, roundUUID) => {
    // Make sure this round belongs to this user by seeing if the corresponding course belongs
    // to this user.
    const roundUserUUID = (await db`SELECT useruuid FROM ${SCHEMA}.courses WHERE courseuuid =
        (SELECT courseuuid FROM ${SCHEMA}.rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        const result = await db`UPDATE ${SCHEMA}.rounds SET deleted = TRUE WHERE rounduuid = ${roundUUID}`;
        return result.count > 0;
    }
    return false;
}

const getAllRounds = async (userUUID) => {
    const result = await db`SELECT r.* FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID} AND c.deleted = FALSE AND r.deleted = FALSE`;
    return result;
}

const deleteAllRoundsHard = async (userUUID) => {
    const result = await db`SELECT r.* FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID}`;
    return result;
}

const deleteAllRoundsSoft = async (userUUID) => {
    const result = await db`UPDATE ${SCHEMA}.rounds SET deleted = TRUE FROM ${SCHEMA}.courses c
        WHERE ${SCHEMA}.rounds.courseuuid = c.courseuuid AND c.useruuid = ${userUUID}`;
    return result;
}

const deleteAllCourseRoundsHard = async (userUUID, courseUUID) => {
    const result = await db`DELETE FROM
        ${SCHEMA}.rounds r USING ${SCHEMA}.courses c
        WHERE c.courseuuid = r.courseuuid AND
        c.useruuid = ${userUUID} AND r.courseuuid = ${courseUUID}`;
    return result;
}

const getAllCourseRounds = async (courseUUID, user=undefined) => {
    const result = await db`SELECT data FROM ${SCHEMA}.rounds WHERE courseuuid = ${courseUUID} AND deleted = FALSE`;
    return result.map(round => round.data);
}

const getUserRoundsCount = async (userUUID) => {
    const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID} AND c.deleted = FALSE AND r.deleted = FALSE`;
    return parseInt(result?.count || 0);
}

const getMostRecentRounds = async (userUUID, numberOfRounds=3) => {
    const result = await db`SELECT c.data->'name' AS name, c.courseuuid AS courseuuid, r.data->'score' AS score, r.played_at as played_at FROM ${SCHEMA}.rounds r JOIN ${SCHEMA}.courses c ON
        r.courseuuid = c.courseuuid WHERE c.useruuid = ${userUUID} AND c.deleted = FALSE AND r.deleted = FALSE
        ORDER BY played_at DESC LIMIT ${numberOfRounds}`;
    return result;
}

const getAllRoundChangesAfterTimestamp = async (userUUID, timestamp) => {
    const result = await db`SELECT * FROM ${SCHEMA}.courses
        WHERE useruuid = ${userUUID} AND modified_at > ${timestamp}`;
    return result;
}


export { addRound, addRounds, modifyRound,
    deleteRoundHard, deleteRoundSoft, getAllRounds,
    deleteAllRoundsHard, deleteAllRoundsSoft, deleteAllCourseRoundsHard,
    getAllCourseRounds, getUserRoundsCount,
    getMostRecentRounds, getAllRoundChangesAfterTimestamp };