import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { handleGoogleLoginRequest } from "./auth/google.mjs";
import { validateToken } from "./auth/tokens.mjs";
import { addCourse, modifyCourse } from "./req/courses.mjs";
import { getAllCloudData, uploadBulkData } from "./req/bulkData.mjs";

configDotenv();
const PORT = process.env.PORT;
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME

const app = express();

const corsOptions = {
    origin: CLIENT_HOSTNAME,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.options("/", cors(corsOptions));

app.use(express.json()); // Automatically parse body when json
app.use(cookieParser()); // Automatically parse cookies

app.get("/ready", async (req, res) => {
    res.status(200).send("Server is ready.");
});

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
            console.log("Errors: ", updateResults.errors);
            res.status(200).json({
                updatesSucceeded: updateResults.updatesSucceeded,
                updatesFailed: updateResults.updatesFailed,
                errors: updateResults.errors,
                updateQueue: updateResults.data
            });
        } catch (error) {
            res.status(400).send(error);
            console.log(error);
        } 
});

// If the user wants to get all their data from the cloud (such as when logging in)
app.get("/data", async (req, res) => {
    // Validate token
    const user = await validateToken(req.cookies.token);
    if(user === null) {
        res.status(401).send("Can't validate user.");
        return;
    }
    try {
        const result = await getAllCloudData(user);
        res.status(200).json({
            courses: result.courses,
            rounds: result.rounds
        });
        console.log("here")
    } catch (error) {
        res.status(400).send("Failed to retrieve data from cloud.");
        console.log(error);
    }
});

// starts a simple http server locally on port 3000
app.listen(PORT || 3000, "localhost", () => console.log(`Listening to requests from ${CLIENT_HOSTNAME} on port ${PORT}...`));
