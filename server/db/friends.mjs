import db, { SCHEMA } from "./db_setup.mjs";

export const areFriends = async (user1uuid, user2uuid) => {
    const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.friends WHERE
        user1uuid = ${user1uuid} AND user2uuid = ${user2uuid}`;
    return result.count > 0;
}

export const createFriendRequest = async (senderUUID, receiverUUID) => {
    const result = await db`INSERT INTO ${SCHEMA}.friend_requests (sender, receiver, created_at)
        VALUES (${senderUUID}, ${receiverUUID}, now())
        ON CONFLICT (sender, receiver)
        DO UPDATE SET created_at = now() RETURNING *`;
    if(result && result.length > 0) {
        return true;
    }
    return false;
}

export const findFriendRequest = async (userUUID, targetUserUUID) => {
    const result = await db`SELECT * FROM ${SCHEMA}.friend_requests WHERE
        (sender = ${userUUID} AND receiver = ${targetUserUUID})
        OR (sender = ${targetUserUUID} AND receiver = ${userUUID})`;
    // If no friend request in either direction
    if(!result || result.length == 0) return null;
    // If a friend request was found
    const request = result[0];
    // If this user send the request to target user
    if(request.sender === userUUID) return "sent";
    // Otherwise, they received a request
    else return "received";
}