import db, { SCHEMA } from "../db/db_setup.mjs";
import { randomUUID } from "crypto";

export const tokenOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 2_592_000_000
}

const generateToken = async (email) => {
    // Attempt to create a token
    try {
        const token = randomUUID();
        await db`INSERT INTO ${SCHEMA}.tokens (token, userUUID)
            VALUES (
                ${token}, (SELECT useruuid FROM ${SCHEMA}.users WHERE email = ${email})
            )`;
        return token;
    } catch (error) {
        console.log("Error generating token in DB: " + error);
        return null;
    }
}

/**
 * 
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
const validateToken = async (req, res) => {
    const token = req.cookies.token;
    if(!token) {
        console.log("No token provided.");
        return null;
    }
    try {
        // User token to find token that maps to the user
        let user = await db`SELECT * FROM ${SCHEMA}.users WHERE useruuid = (SELECT useruuid FROM ${SCHEMA}.tokens WHERE token = ${token})`;
        user = user[0];
        if(!user) {
            console.log("Can't find user in database.");
            throw("Can't map token to a user.");
        }
        // Renew cookie
        res.cookie("token", token, tokenOptions);
        return user;
    }
    catch (error) {
        console.log("Error validating token: " + error);
        return null;
    }
}

export { generateToken, validateToken };