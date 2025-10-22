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

export const findFriendRequest = async (useruuid, targetUserUUID) => {
    const result = await db`SELECT * FROM ${SCHEMA}.friend_requests WHERE
        (sender = ${useruuid} AND receiver = ${targetUserUUID})
        OR (sender = ${targetUserUUID} AND receiver = ${useruuid})`;
    // If no friend request in either direction
    if(!result || result.length == 0) return null;
    // If a friend request was found
    const request = result[0];
    // If this user sent the request to target user
    if(request.sender === useruuid) return "sent";
    // Otherwise, they received a request
    else return "received";
}

export const getAllFriendRequests = async (useruuid) => {
    const result = await db`SELECT users.useruuid, users.username FROM
        ${SCHEMA}.friend_requests friend_requests JOIN
        ${SCHEMA}.users users
        ON friend_requests.sender = users.useruuid
        WHERE receiver = ${useruuid}`;
    return result;
}

export const getFriendRequestCount = async (useruuid) => {
    const result = await db`SELECT COUNT (*) FROM
        ${SCHEMA}.friend_requests friend_requests JOIN
        ${SCHEMA}.users users
        ON friend_requests.sender = users.useruuid
        WHERE receiver = ${useruuid}`;
        console.log(result);
    return result[0].count;
}

export const removeFriendReqeust = async (useruuid, targetUserUUID) => {
    await db`DELETE FROM ${SCHEMA}.friend_requests WHERE
        (sender = ${useruuid} AND receiver = ${targetUserUUID})`;
}

export const removeFriend = async (useruuid, targetUserUUID) => {
    await db`DELETE FROM ${SCHEMA}.friends WHERE
        (user1uuid = ${useruuid} AND user2uuid = ${targetUserUUID}) OR
        (user1uuid = ${targetUserUUID} AND user2uuid = ${useruuid})`;
}

export const addFriend = async (user1UUID, user2UUID) => {
    await db`INSERT INTO ${SCHEMA}.friends (user1uuid, user2uuid) VALUES
        (${user1UUID}, ${user2UUID})`;
    await db`INSERT INTO ${SCHEMA}.friends (user1uuid, user2uuid) VALUES
        (${user2UUID}, ${user1UUID})`;
}

// Response is either "accept" or "decline"
export const respondFriendReqeust = async (useruuid, targetUserUUID, response) => {
    // Make sure the request exists
    if(await findFriendRequest(useruuid, targetUserUUID) !== "received") {
        return { success: false, error: "There is no friend request from this user." };
    }
    if(response === "accept") {
        await removeFriendReqeust(targetUserUUID, useruuid);
        await addFriend(useruuid, targetUserUUID);
        return { success: true };
    }
    else if(response === "decline") {
        await removeFriendReqeust(targetUserUUID, useruuid);
        return { success: true };
    }
    else {
        return { success: false, error: "Can't determine what the user wants to do with the request." };
    }
}

export const getAllFriends = async (useruuid) => {
    const result = await db`SELECT users.username AS username, users.useruuid AS useruuid
        FROM ${SCHEMA}.users users JOIN ${SCHEMA}.friends friends
        ON users.useruuid = friends.user2uuid
        WHERE friends.user1uuid = ${useruuid}`;
    return result;
}