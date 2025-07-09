import { validateToken } from "../auth/tokens.mjs";
import { getAllCoursesProfile } from "../db/courses.mjs";
import { getAllCourseRounds, getMostRecentRounds, getUserRoundsCount } from "../db/rounds.mjs";
import { findUser, findUserByUsername, setProfileVisibility } from "../db/users.mjs";

// See if a user is allowed to see another user's data
export const getVisibleProfile = async (profileUserUsername, viewerUserUUID) => {
    if(!profileUserUsername) {
        return null;
    }
    const profileUser = await findUserByUsername(profileUserUsername);
    // If this user doesn't exist
    if(!profileUser) {
        return null;
    }
    // If this is the same user, always allow
    if(profileUser.useruuid === viewerUserUUID) {
        return profileUser;
    }
    // If the profile is public, allow
    if(profileUser.public_profile) {
        return profileUser;
    }

    // See if they are friends... later...

    return false;
}

/**
 * @param {import("express").Express} app
 */
export const registerGetProfileEndpoint = (app) => {
    // If the user wants to get the profile of a player
    app.get("/profile/:username", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        
        try {
            const searchUser = await getVisibleProfile(req.params.username, user?.useruuid);
            // If profile doesn't exist
            if(searchUser === null) {
                res.status(404).json({
                    error: "There are no users with this username"
                });
                return;
            }
            // If user is not allowed to see this profile
            if(searchUser === false) {
                res.status(200).json({
                    username: searchUser.username,
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
                    courses: courses,
                    roundCount: roundCount,
                    rounds: rounds,
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
            const rounds = await getAllCourseRounds(req.params.courseuuid);
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