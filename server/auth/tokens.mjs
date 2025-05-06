import crypto from "crypto";
import db from "../db/db_setup.mjs";

const generateToken = async (email) => {
    // Attempt to create a token
    try {
        const token = await db`INSERT INTO tokens (user_id)
            VALUES (
                (SELECT id FROM users WHERE email = ${email})
            )
            RETURNING token`;
        return token;
    } catch (error) {
        console.log("Error generating token in DB: " + error);
        return null;
    }
}

export { generateToken };