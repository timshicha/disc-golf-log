import { addUser, findUserByEmail } from "../db/users.mjs";
import { generateToken, tokenOptions } from "./tokens.mjs";



/**
 * 
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {string} email
 */
const handleSuccessfulLogin = async (req, res, email) => {
    let isNewUser = false;
    // Find user by email
    let user = await findUserByEmail(email);
    // If user doesn't exist, add them
    if(!user) {
        isNewUser = true;
        user = await addUser(email, {});
    }

    const token = await generateToken(email);
    // If a token was generated, set as a cookie
    if(token) {
        res.cookie("token", token, tokenOptions);
        console.log(`Token set for ${email}: ${token}`);
        res.status(200).json({
            email: user.email,
            data: user.data,
            username: user.username,
            isNewUser: isNewUser,
            username_modified: user.username_modified
        });
    }
    // If token not set
    else {
        res.status(500).json({
            success: false,
            error: "User authenticated but token could not be set."
        });
    }
}

export { handleSuccessfulLogin };