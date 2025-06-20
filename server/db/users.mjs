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
    
    return await db`INSERT INTO ${SCHEMA}.users (email, useruuid, data, username) VALUES (${safeEmail}, ${userUUID}, ${safeUserData}, ${generatedUsername})`;
}

export { findUserByEmail, addUser };