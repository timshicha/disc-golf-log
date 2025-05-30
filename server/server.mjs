import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { exchangeGoogleCodeForToken, fetchUserGoogleInfo, handleGoogleLoginRequest } from "./auth/google.mjs";
import { validateToken } from "./auth/tokens.mjs";
import { addCourse, modifyCourse } from "./req/courses.mjs";
import { uploadBulkData } from "./req/bulkData.mjs";

configDotenv();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const ENV = process.env.ENV
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME

const app = express();
app.use(cors({
    origin: CLIENT_HOSTNAME,
    credentials: true,
    methods: ["GET", "POST", "PUT", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json()); // Automatically parse body when json
app.use(cookieParser()); // Automatically parse cookies

// If logging in (user wants a token)
app.post("/auth/google", async (req, res) => {
    handleGoogleLoginRequest(req, res);
});

// If adding a course
app.post("/course", async (req, res) => {
    // Try validating token
    const user_id = await validateToken(req.cookies.token);
    if(user_id === null) {
        res.status(401).send("Can't validate user.");
        return;
    }
    // At this point the user has been validated and we have their userID
    try {
        await addCourse(user_id, req.body?.name, req.body?.holes);
        res.status(200);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    }    
});

// If modifying a course
app.put("/course", async (req, res) => {
    // Validate token
    const user_id = await validateToken(req.cookies.token);
    if(user_id === null) {
        res.status(401).send("Can't validate user.");
        return;
    }
    // At this point the user has been validated and we have their userID
    try {
        await modifyCourse(user_id, req.body?.name, req.body?.newName);
        res.status(200);
    } catch (error) {
        res.status(400).send(error);
        console.log(error);
    } 
});

// If the user sends a list of modifications
app.post("/data", async (req, res) => {
        // Validate token
        const user = await validateToken(req.cookies.token);
        if(user === null) {
            res.status(401).send("Can't validate user.");
            return;
        }
        // At this point the user has been validated and we have their userID
        try {
            const updateResults = await uploadBulkData(user, req.body.data);
            console.log(`${user.email}: Updated: ${updateResults.updatesSucceeded} (${updateResults.updatesFailed} failed)`);
            res.status(200);
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        } 
})

// starts a simple http server locally on port 3000
app.listen(PORT, "localhost", () => console.log("Listening on 3000..."));
