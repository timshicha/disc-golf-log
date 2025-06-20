import { addUser, findUserByEmail } from "../db/users.mjs";
import { generateToken } from "./tokens.mjs";

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
        await addUser(email, {});
        user = {
            email: email,
            data: {}
        };
    }

    const token = await generateToken(email);
    // If a token was generated, set as a cookie
    if(token) {
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "None",
            maxAge: 2_592_000_000
        });
        console.log(`Token set for ${email}: ${token}`);
        res.status(200).json({
            email: user.email,
            data: user.data,
            username: user.username,
            isNewUser: isNewUser
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