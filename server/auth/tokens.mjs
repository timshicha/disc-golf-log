import crypto from "crypto";
import db from "../db/db_setup.mjs";
import { randomUUID } from "crypto";


const generateToken = async (email) => {
    // Attempt to create a token
    try {
        const token = randomUUID();
        await db`INSERT INTO tokens (user_id, token)
            VALUES (
                (SELECT id FROM users WHERE email = ${email}), ${token}
            )`;
        return token;
    } catch (error) {
        console.log("Error generating token in DB: " + error);
        return null;
    }
}

const validateToken = async (token) => {
    if(!token) {
        console.log("Error validating token: no token");
        return null;
    }
    try {
        console.log("Validating token: " + token);
        const userObj = await db`SELECT user_id FROM tokens WHERE token = ${token}`;
        const userID = userObj[0]?.user_id;
        if(!userID) {
            throw("Can't map token to a user.");
        }
        console.log("Token validated! User ID: " + userID);
        return userID;
    }
    catch (error) {
        console.log("Error validating token: " + error);
        return null;
    }
}

export { generateToken, validateToken };