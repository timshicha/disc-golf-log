import db, { SCHEMA } from "./db_setup.mjs";

export const areFriends = async (user1uuid, user2uuid) => {
    const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.friends WHERE
        user1uuid = ${user1uuid} AND user2uuid = ${user2uuid}`;
    return result.count > 0;
}