import db from "./db_setup.mjs";

// Find a user with a certain email.
// May fail so be sure to wrap in try block!
const findUserByEmail = async (email) => {
    const [user] = await db`SELECT * FROM users WHERE email = ${email} LIMIT 1`;
    return user;
}

export { findUserByEmail };