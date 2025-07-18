import { validateToken } from "../auth/tokens.mjs";
import { createFriendRequest, findFriendRequest } from "../db/friends.mjs";

/**
 * @param {import("express").Express} app
 */
export const registerSendFriendRequestEndpoint = (app) => {
    // Update settings
    app.post("/friends/send_request", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(!user) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            // See who the request is for
            const receiverUUID = req.body.userUUID;
            if(!receiverUUID) {
                throw new Error ("Server cannot determine who to send the request to.");
            }
            
            // See if there is already a friend request sent or received
            const existingRequest = await findFriendRequest(user.useruuid, receiverUUID);
            if(existingRequest) {
                // If request already sent
                if(existingRequest === "sent") {
                    throw new Error ("You have already sent a friend request to this user.");
                }
                // If request already received from this user
                else {
                    throw new Error ("This user already sent you a friend request.");
                }
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
            console.log(error)
            res.status(400).send(error.message);
        }
    });
}