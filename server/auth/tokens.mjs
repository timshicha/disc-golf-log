import crypto from "crypto";
import db from "../db/db_setup.mjs";
import { randomUUID } from "crypto";


const generateToken = async (email) => {
    // Attempt to create a token
    try {
        const token = randomUUID();
        await db`INSERT INTO tokens (token, userUUID)
            VALUES (
                ${token}, (SELECT useruuid FROM users WHERE email = ${email})
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
        // User token to find token that maps to the user
        let user = await db`SELECT * FROM users WHERE useruuid = (SELECT useruuid FROM tokens WHERE token = ${token})`;
        user = user[0];
        if(!user) {
            throw("Can't map token to a user.");
        }
        console.log("Token validated! User:", user.email);
        return user;
    }
    catch (error) {
        console.log("Error validating token: " + error);
        return null;
    }
}

export { generateToken, validateToken };