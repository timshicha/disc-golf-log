import { validateToken } from "../auth/tokens.mjs";
import { changeUsername } from "../db/users.mjs";

/**
 * @param {import("express").Express} app
 */
export const registerChangeUsernameEndpoint = (app) => {
    // If the user requests to change thier username
    app.post("/username", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        const newUsername = req.body.newUsername;
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        // At this point the user has been validated and we have their userID
        try {
            // Try to change username
            const result = await changeUsername(user, newUsername);
            if(result.success) {
                res.status(200).json({
                    success: true
                });
                return;
            }
            else {
                res.status(400).json(result);
            }
                
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        } 
    });
}