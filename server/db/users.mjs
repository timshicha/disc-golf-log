import db, { SCHEMA } from "./db_setup.mjs";
import { sql } from "slonik";
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
    const safeUserData = userData;
    return await db`INSERT INTO ${SCHEMA}.users (email, useruuid, data) VALUES (${safeEmail}, ${userUUID}, ${safeUserData})`;
}

export { findUserByEmail, addUser };