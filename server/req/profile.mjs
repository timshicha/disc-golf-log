import { validateToken } from "../auth/tokens.mjs";
import { getAllCourseNames } from "../db/courses.mjs";
import { findUserByUsername } from "../db/users.mjs";

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
                throw new Error ("Could not find user.");
            }
            const result = await getAllCourseNames(searchUser.useruuid);
            res.status(200).json({
                username: searchUser.username,
                courses: result
            });
        } catch (error) {
            res.status(400).send("Could not get data.");
            console.log(error);
        }
    });
}