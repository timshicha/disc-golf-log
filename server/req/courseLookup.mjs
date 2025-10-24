
import { findCourseInfoByCourseUUID } from "../db/course_info.mjs";
import { bucket, getImageUrl } from "../object-storage/googleCloudStorage.mjs";



/**
 * @param {import("express").Express} app
 */
export const registerGetCourseInfoEndpoint = (app) => {

    app.get("/course-map/:uuid", async (req, res) => {
        try {
            // If updating profile visibility
            res.setHeader("Content-Type", "application/json");
            const result = await findCourseInfoByCourseUUID(req.params.uuid);
            console.log(result);
            if(!result) {
                res.status(404).send("Course map not found.");
                return;
            }
            else {
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
            res.status(500).send("Internal server error.");
        }
    });
}