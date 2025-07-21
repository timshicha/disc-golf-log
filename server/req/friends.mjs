import { response } from "express";
import { validateToken } from "../auth/tokens.mjs";
import { createFriendRequest, findFriendRequest, getAllFriends, removeFriend, removeFriendReqeust, respondFriendReqeust } from "../db/friends.mjs";

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

            // Make sure they're not sending a request to themselves
            if(receiverUUID === user.useruuid) {
                throw new Error ("Cannot send friend request to yourself.");
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

/**
 * @param {import("express").Express} app
 */
export const registerRespondFriendRequestEndpoint = (app) => {
    // Update settings
    app.post("/friends/respond_request", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(!user) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            // See which request responding to
            const targetUserUUID = req.body.userUUID;
            if(!targetUserUUID) {
                throw new Error ("Server cannot determine which request user is responding to.");
            }
            // See what the response is
            const requestResponse = req.body.response;
            if(!requestResponse) {
                throw new Error ("Server cannot determine what the user wants to do with the request.");
            }
            
            const result = await respondFriendReqeust(user.useruuid, targetUserUUID, requestResponse);
            if(result.success) {
                res.status(200).json({ success: true });
            }
            else {
                throw new Error (result.error);
            }

        } catch (error) {
            console.log(error)
            res.status(400).send(error.message);
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerUndoSendFriendRequestEndpoint = (app) => {
    // Update settings
    app.post("/friends/undo_send_request", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(!user) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            // See which user to unsend to
            const targetUserUUID = req.body.userUUID;
            if(!targetUserUUID) {
                throw new Error ("Server cannot determine which user to unsend the request to.");
            }
            
            await removeFriendReqeust(user.useruuid, targetUserUUID);
            res.status(200).json({ success: true });

        } catch (error) {
            console.log(error)
            res.status(400).send(error.message);
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerRemoveFriendEndpoint = (app) => {
    // Update settings
    app.post("/friends/remove_friend", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(!user) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            // See which user to unfriend
            const targetUserUUID = req.body.userUUID;
            if(!targetUserUUID) {
                throw new Error ("Server cannot determine which user to unfriend.");
            }
            
            await removeFriend(user.useruuid, targetUserUUID);
            res.status(200).json({ success: true });

        } catch (error) {
            console.log(error)
            res.status(400).send(error.message);
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerGetAllFriendsEndpoint = (app) => {
    // Update settings
    app.get("/friends", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(!user) {
            res.status(401).send("Can't validate user.");
            return;
        }
        try {
            const result = await getAllFriends(user.useruuid);
            res.status(200).json({ friends: result });

        } catch (error) {
            console.log(error)
            res.status(400).send(error.message);
        }
    });
}