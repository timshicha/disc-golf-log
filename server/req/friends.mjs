import { validateToken } from "../auth/tokens.mjs";
import { createFriendRequest } from "../db/friends.mjs";

/**
 * @param {import("express").Express} app
 */
export const registerSendFriendRequestEndpoint = (app) => {
    // Update settings
    app.post("/friends/send_request", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            // See who the request is for
            const receiverUUID = req.body.userUUID;
            if(!receiverUUID) {
                throw new Error ("Server cannot determine who to send the request to.");
            }
            
            // On successful friend request
            if(await createFriendRequest(user.useruuid, receiverUUID)) {
                res.status(200).json({
                    success: true
                });
            }
            else {
                throw new Error ("Server could not find the user you're trying to send the request to.");
            }

        } catch (error) {
            res.status(400).send(error);
        }
    });
}