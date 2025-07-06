import { isValidUsername } from "../utils/format.mjs";
import { generateUsername } from "../utils/generators.mjs";
import db, { SCHEMA } from "./db_setup.mjs";
import { randomUUID } from "crypto";
import { v4 as uuidv4 } from "uuid";

// Find a user with a certain email.
// May fail so be sure to wrap in try block!
const findUserByEmail = async (email) => {
    const [user] = await db`SELECT * FROM ${SCHEMA}.users WHERE email = ${email} LIMIT 1`;
    return user;
}

// Find a user by username
const findUserByUsername = async (username, caseSensitive=true) => {
    if(caseSensitive) {
        const [user] = await db`SELECT * FROM ${SCHEMA}.users WHERE username = ${username} LIMIT 1`;
        return user;
    }
    else {
        const [user] = await db`SELECT * FROM ${SCHEMA}.users WHERE UPPER(username) = UPPER(${username}) LIMIT 1`;
        return user;
    }
}

// Add a user with email
const addUser = async (email, userData) => {
    // Create a userUUID
    const userUUID = randomUUID();
    // Stringigy all data
    const safeEmail = String(email);
    
    // A username will be generated and checked if it's taken. If taken, a new one will be generated.
    // This will repeat MAX_CYCLES times before failing. If it fails 10 times, we will generate a
    // uuid. This is not ideal but works.
    let generatedUsername = generateUsername();
    const MAX_CYCLES = 50;
    for (let i = 0; !isUsernameAvailable(generatedUsername) && i < MAX_CYCLES; i++) {
        generatedUsername = generateUsername();
        if(i === MAX_CYCLES - 1) {
            generatedUsername = uuidv4();
        }
    }
    
    const [user] = await db`INSERT INTO ${SCHEMA}.users (email, useruuid, data, username) VALUES (${safeEmail}, ${userUUID}, ${userData}, ${generatedUsername}) RETURNING *`;
    return user;
}

const isUsernameAvailable = async (username) => {
    try {
        const [result] = await db`SELECT COUNT(*) FROM ${SCHEMA}.users WHERE LOWER(username) = LOWER(${username})`;
        if(Number(result.count) > 0) return false;
        return true;
    } catch (error) {
        return false;
    }
}

// Change username
const changeUsername = async (user, newUsername) => {
    // Make sure this use has not yet changed their username
    if(user.username_modified) {
        return { success: false, error: "Username has already been changed once"};
    }
    // Make sure this new username is valid
    const validUsername = isValidUsername(newUsername);
    if(!validUsername.isValid) {
        return { success: false, error: validUsername.error };
    }
    try {
        // Make sure username is not used by anyone else
        if(!isUsernameAvailable(newUsername)) {
            return { success: false, error: "This usename is taken" };
        }
        // Otherwise try to update
        user.data.username = newUsername;
        await db`UPDATE ${SCHEMA}.users SET username = ${newUsername}, username_modified = true, data = ${user.data}
            WHERE useruuid = ${user.useruuid}`;
        return { success: true, error: null };
    } catch (error) {
        console.log(`Could not change username: ${error}`);
        return { success: false, error: "An error occured in the server." };
    }
}

// Adjust profile visibility
const setProfileVisibility = async (user, public_profile=false) => {
    try {
        if(!user) {
            return { success: false, error: "User not provided."};
        }
        if(public_profile === true || public_profile === false) {
            await db`UPDATE ${SCHEMA}.users SET public_profile = ${public_profile}
                WHERE useruuid = ${user.useruuid}`;
            return { success: true, error: null };
        }
    } catch (error) {
        console.log(`Could not change profile visibility: ${error}`);
        return { success: false, error: "An error occured in the server." };
    }
}

export { findUserByEmail, findUserByUsername, addUser, isUsernameAvailable, changeUsername,
    setProfileVisibility
};