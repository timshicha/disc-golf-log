import { isValidUsername } from "../utils/format.mjs";
import db, { SCHEMA } from "./db_setup.mjs";
import { randomUUID } from "crypto";

// Find a user with a certain email.
// May fail so be sure to wrap in try block!
const findUserByEmail = async (email) => {
    const [user] = await db`SELECT * FROM ${SCHEMA}.users WHERE email = ${email} LIMIT 1`;
    return user;
}

// Add a user with email
const addUser = async (email, userData) => {
    // Create a userUUID
    const userUUID = randomUUID();
    // Stringigy all data
    const safeEmail = String(email);
    
    const generatedUserNumber = (await db`SELECT nextval('${SCHEMA}.user_number_seq') AS user_number`)[0].user_number;
    const generatedUsername = `user${generatedUserNumber}`;
    userData.username = generatedUsername;
    
    const [user] = await db`INSERT INTO ${SCHEMA}.users (email, useruuid, data, username) VALUES (${safeEmail}, ${userUUID}, ${userData}, ${generatedUsername}) RETURNING *`;
    return user;
}

// Change username
const changeUsername = async (user, newUsername) => {
    // Make sure this use has not yet changed their username
    // if(user.username_modified) {
    //     return { success: false, error: "Username has already been changed once"};
    // }
    // Make sure this new username is valid
    const validUsername = isValidUsername(newUsername);
    if(!validUsername.isValid) {
        return { success: false, error: validUsername.error };
    }
    try {
        // Make sure username is not used by anyone else
        const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.users WHERE username = ${newUsername}`;
        const count = Number(result.count);
        if(count > 0) {
            return { success: false, error: "This usename is taken" };
        }
        // Otherwise try to update
        await db`UPDATE ${SCHEMA}.users SET username = ${newUsername}, username_modified = true
            WHERE useruuid = ${user.useruuid}`;
        return { success: true, error: null };
    } catch (error) {
        console.log(`Could not change username: ${error}`);
        return { success: false, error: "An error occured in the server." };
    }
}

export { findUserByEmail, addUser, changeUsername };