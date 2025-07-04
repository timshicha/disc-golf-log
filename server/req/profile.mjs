import { validateToken } from "../auth/tokens.mjs";
import { getAllCourseNames } from "../db/courses.mjs";
import { getUserRoundsCount } from "../db/rounds.mjs";
import { findUserByUsername, setProfileVisibility } from "../db/users.mjs";

/**
 * @param {import("express").Express} app
 */
export const registerGetProfileEndpoint = (app) => {
    // If the user wants to get the profile of a player
    app.get("/profile/:username", async (req, res) => {
        // Validate token
        const user = await validateToken(req, res);
        if(user === null) {
            console.log("user not logged in, dont allow viewing of private profiles");
        }
        
        try {
            const searchUser = await findUserByUsername(req.params.username, false);
            if(!searchUser) {
                res.status(404).json({
                    error: "There are no users with this username"
                });
                return;
            }
            // If profile is private (and this is not the user)
            if(!searchUser.public_profile && user.useruuid !== searchUser.useruuid) {
                res.status(200).json({
                    username: searchUser.username,
                    visible: false
                });
            }
            // If their profile is public
            else {
                const courses = await getAllCourseNames(searchUser.useruuid);
                const roundCount = await getUserRoundsCount(searchUser.useruuid);
                res.status(200).json({
                    username: searchUser.username,
                    courses: courses,
                    roundCount: roundCount,
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