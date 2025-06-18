
// If a user wants to log in with email, send a code to that email

import { addEmailLoginCode, confirmEmailLoginCode } from "../db/auth.mjs";
import { sendEmail } from "../utils/emailSender.mjs";

/**
 * @param {import("express").Express} app 
 */
const registerEmailAuthEndpoint = (app) => {
    // If logging in (user wants a token)
    app.post("/auth/email", async (req, res) => {
        const email = req.body?.email;
        const code = req.body?.code;
        // If we want the code or to login (code provided)
        const desired = req.body?.desired;

        // If an email was provided, send that email a code.
        // If a code was provided, confirm that the code is valid
        // and return a token.

        // If email
        if(desired === "code") {
            // Send email
            // Create a random 6-digit number, turn to string, and pad with 0's
            // Ex: "045228"
            const code = Math.floor(Math.random() * 1_000_000).toString().padStart(6, "0");
            // Insert the number into the database
            // Code expires in 10 minutes = 1000 * 60 * 10 = 600_000
            const expiresAt = Date.now() + 600_000;
            if(await addEmailLoginCode(email, new Date(expiresAt), code)) {
                const result = await sendEmail(email, "Your Login Code", code);
                console.log(result);
            }
            res.status(200);
        }
        // If code
        else if(desired === "login"){
            const result = await confirmEmailLoginCode(email, code);
            if(result.success === true) {
                console.log("Code confirmed? Logged in!");
                res.status(200);
            }
            else {
                // See if the code is correct
                res.status(401);
            }
        }
        // If neither
        else {
            res.status(400).json({
                success: false,
                error: "Specify if you want the code or to login."
            });
        }
    });
}



export { registerEmailAuthEndpoint };
    