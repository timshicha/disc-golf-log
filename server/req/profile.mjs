import { validateToken } from "../auth/tokens.mjs";
import { getAllCoursesProfile } from "../db/courses.mjs";
import { areFriends, findFriendRequest } from "../db/friends.mjs";
import { getAllCourseRounds, getMostRecentRounds, getUserRoundsCount } from "../db/rounds.mjs";
import { findUser, findUserByUsername, setProfileVisibility } from "../db/users.mjs";

// See if a user is allowed to see another user's data
export const getVisibleProfile = async (profileUser, viewerUser) => {
    if(!profileUser) {
        return null;
    }
    // If this is the same user, always allow
    if(profileUser.useruuid === viewerUser?.useruuid) {
        return {
            visible: true,
            friends: null,
            user: profileUser
        };
    }
    // If the profile is public, allow
    if(profileUser.public_profile) {
        // If a user that's not logged in is viewing, always specify
        // that they are not friends
        if(!viewerUser) {
            return { visible: true, friends: false, user: profileUser };
        }
        // Otherwise see if they are friends to specify their friendship
        const friendship = (viewerUser ? await areFriends(viewerUser.useruuid, profileUser.useruuid) : false);
        // If friends, return the result
        if(friendship) {
            return { visible: true, friends: true, user: profileUser };
        }
        // Otherwise see if a request has already been sent or received
        else {
            const friendRequest = await findFriendRequest(viewerUser.useruuid, profileUser.useruuid);
            return { visible: true, friends: false, friendRequest: friendRequest, user: profileUser };
        }
    }
    if(viewerUser && await areFriends(viewerUser.useruuid, profileUser.useruuid)) {
        return { visible: true, friends: true, user: profileUser };
    }
    let friendRequest = null;
    // Check if friend request has been sent or received
    if(viewerUser) {
        friendRequest = await findFriendRequest(viewerUser.useruuid, profileUser.useruuid);
    }
    return { visible: false, friends: false, friendRequest: friendRequest, user: profileUser };
}

/**
 * @param {import("express").Express} app
 */
export const registerGetProfileEndpoint = (app) => {
    // If the user wants to get the profile of a player
    app.get("/profile/:username", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        // Find the other user
        const profileUser = await findUserByUsername(req.params.username, false);
        
        try {
            const searchResult = await getVisibleProfile(profileUser, user);
            // If profile doesn't exist
            if(searchResult === null) {
                res.status(404).json({
                    error: "There are no users with this username"
                });
                return;
            }
            const searchUser = searchResult.user;
            // If user is not allowed to see this profile
            if(!searchResult.visible) {
                res.status(200).json({
                    username: searchUser.username,
                    userUUID: searchUser.useruuid,
                    friends: searchResult.friends,
                    friendRequest: searchResult.friendRequest,
                    visible: false
                });
            }
            // If their profile is public or user is allowed to see it
            else {
                const courses = await getAllCoursesProfile(searchUser.useruuid);
                const roundCount = await getUserRoundsCount(searchUser.useruuid);
                const rounds = await getMostRecentRounds(searchUser.useruuid, 5);
                res.status(200).json({
                    username: searchUser.username,
                    userUUID: searchUser.useruuid,
                    courses: courses,
                    roundCount: roundCount,
                    rounds: rounds,
                    friends: searchResult.friends,
                    friendRequest: searchResult.friendRequest,
                    visible: true
                });
            }
        } catch (error) {
            res.status(400).send("Could not get data.");
            console.log(error);
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerGetProfileCourseEndpoint = (app) => {
    // If the user wants to get the course of a player
    app.get("/course/:courseuuid", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(user === null) {
            console.log("user not logged in, dont allow viewing of private profiles");
        }
        
        try {
            // Make sure the useruuid of the course belongs to someone who this user is
            // allowed to view

            // If their profile is public
            const rounds = await getAllCourseRounds(req.params.courseuuid, user);
            res.status(200).json({
                rounds: rounds,
            });
        } catch (error) {
            res.status(400).send("Could not get data.");
            console.log(error);
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerUpdateProfileVisibility = (app) => {
    // Update settings
    app.post("/settings/public_profile", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        console.log(req.body)
        try {
            // If updating profile visibility
            if(req.body.public_profile === true || req.body.public_profile === false) {
                const result = await setProfileVisibility(user, req.body.public_profile);
                if(!result.success) {
                    throw new Error (result.error);
                }
            }
            else {
                throw new Error ("Server did not receive a profile setting option.");
            }
            res.status(200).json({
                success: true
            });
        } catch (error) {
            res.status(400).send("Could not update settings.");
            console.log(error);
        }
    });
}