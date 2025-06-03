import db from "../db/db_setup.mjs";

const addRound = async (userUUID, roundUUID, courseUUID, data) => {
    // Make sure this course belongs to this user
    const courseUserUUID = (await db`SELECT useruuid FROM courses WHERE courseuuid = ${courseUUID} LIMIT 1`)?.[0]?.useruuid;
    // If user ID's match, add the round
    if(courseUserUUID === userUUID) {
        const result = await db`INSERT INTO rounds (rounduuid, courseuuid, data) VALUES (${roundUUID}, ${courseUUID}, ${data})`;
        return result.count > 0;
    }
    // If not the right user, return false
    return false;
}

const modifyRound = async (userUUID, roundUUID, data) => {
    // Make sure this round belongs to this user. Do this by getting the course ID of this round,
    // and then seeing if the user ID of that course is this user's ID.
    const roundUserUUID = (await db`SELECT useruuid FROM courses WHERE courseuuid =
        (SELECT courseuuid FROM rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        const result = await db`UPDATE rounds SET data = ${data} WHERE rounduuid = ${roundUUID}`;
        return result.count > 0;
    }
    return false;
}

const deleteRound = async (userUUID, roundUUID) => {
    // Make sure this round belongs to this user by seeing if the corresponding course belongs
    // to this user.
    const roundUserUUID = (await db`SELECT useruuid FROM courses WHERE courseuuid =
        (SELECT courseuuid FROM rounds WHERE rounduuid = ${roundUUID}) LIMIT 1`)?.[0]?.useruuid;
    // If the user ID's match, proceed
    if(roundUserUUID === userUUID) {
        console.log(roundUUID);
        const result = await db`DELETE FROM rounds WHERE rounduuid = ${roundUUID}`;
        console.log("res", result.count)
        return result.count > 0;
    }
    return false;
}


export { addRound, modifyRound, deleteRound };