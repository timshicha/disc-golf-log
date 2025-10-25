
import { findCourseInfoByCourseUUID, findCoursesInfoByPartialName } from "../db/course_info.mjs";
import { bucket, getImageUrl } from "../object-storage/googleCloudStorage.mjs";



/**
 * @param {import("express").Express} app
 */
export const registerGetCourseInfoEndpoint = (app) => {

    app.get("/course-info/:uuid", async (req, res) => {
        let errorCode = 400;
        try {
            // If updating profile visibility
            res.setHeader("Content-Type", "application/json");
            const result = await findCourseInfoByCourseUUID(req.params.uuid);
            if(!result) {
                res.status(404).send("Course map not found.");
                return;
            }
            else {
                // If we made it past lookup, then any fail would
                // be a server error
                errorCode = 500;
                // Replace each image path with signed url
                for (let i = 0; i < result.data.images.length; i++) {
                    const imagePath = result.data.images[i].url;
                    const url = await getImageUrl(imagePath);
                    result.data.images[i].url = url;
                }
                res.status(200).send(JSON.stringify(result));
                return;
            }
        } catch (error) {
            console.error("Error in /course-map/:uuid", error);
            if(errorCode === 400) {
                res.status(400).send("Invalid uuid provided.");
            }
            res.status(500).send("Internal server error.");
        }
    });
}

/**
 * @param {import("express").Express} app
 */
export const registerCourseLookupByPartialName = (app) => {

    app.get("/course-lookup/:name_substring", async (req, res) => {
        console.log("pl")
        try {
            // If updating profile visibility
            res.setHeader("Content-Type", "application/json");
            console.log(req.params.name_substring)
            const result = await findCoursesInfoByPartialName(req.params.name_substring);
            if(!result) {
                res.status(404).send("Course map not found.");
                return;
            }
            else {
                res.status(200).send(JSON.stringify(result));
                return;
            }
        } catch (error) {
            console.error("Error in /course-lookup/:name_substring", error);
            res.status(500).send("Internal server error.");
        }
    });
}