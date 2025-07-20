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
    // If this user sent the request to target user
    if(request.sender === userUUID) return "sent";
    // Otherwise, they received a request
    else return "received";
}

export const removeFriendReqeust = async (userUUID, targetUserUUID) => {
    await db`DELETE FROM ${SCHEMA}.friend_requests WHERE
        (sender = ${userUUID} AND receiver = ${targetUserUUID})`;
}

export const removeFriend = async (userUUID, targetUserUUID) => {
    await db`DELTE FROM ${SCHEMA}.friends WHERE
        (user1uuid = ${userUUID} AND user2uuid = ${targetUserUUID}) OR
        (user1uuid = ${targetUserUUID} AND user2uuid = ${userUUID})`;
}

export const addFriend = async (user1UUID, user2UUID) => {
    await db`INSERT INTO ${SCHEMA}.friends (user1uuid, user2uuid) VALUES
        (${user1UUID}, ${user2UUID})`;
    await db`INSERT INTO ${SCHEMA}.friends (user1uuid, user2uuid) VALUES
        (${user2UUID}, ${user1UUID})`;
}

// Response is either "accept" or "decline"
export const respondFriendReqeust = async (userUUID, targetUserUUID, response) => {
    // Make sure the request exists
    if(await findFriendRequest(userUUID, targetUserUUID) !== "received") {
        return { success: false, error: "There is no friend request from this user." };
    }
    if(response === "accept") {
        await removeFriendReqeust(targetUserUUID, userUUID);
        await addFriend(userUUID, targetUserUUID);
        return { success: true };
    }
    else if(response === "decline") {
        await removeFriendReqeust(targetUserUUID, userUUID);
        return { success: true };
    }
    else {
        return { success: false, error: "Can't determine what the user wants to do with the request." };
    }
}

export const getAllFriends = async (userUUID) => {
    const result = await db`SELECT users.username AS username, users.useruuid AS useruuid
        FROM ${SCHEMA}.users users JOIN ${SCHEMA}.friends friends
        ON users.useruuid = friends.user2uuid
        WHERE friends.user1uuid = ${userUUID}`;
    return result;
}