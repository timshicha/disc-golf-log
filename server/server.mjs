import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { configDotenv } from "dotenv";
import { exchangeGoogleCodeForToken, fetchUserGoogleInfo, handleGoogleLoginRequest } from "./auth/google.mjs";
import { validateToken } from "./auth/tokens.mjs";
import { addCourse } from "./req/courses.mjs";

configDotenv();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const ENV = process.env.ENV
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use(cookieParser());

// If logging in (user wants a token)
app.post("/auth/google", async (req, res) => {
    handleGoogleLoginRequest(req, res);
});

// If adding a course
app.post("/course", async (req, res) => {
    // Try validating token
    const user_id = await validateToken(req.cookies.token);
    if(user_id === null) {
        res.status(401).send("Can't validate user");
    }
    else {
        res.status(200).send("Validated. User ID: " + user_id);
    }
});

// starts a simple http server locally on port 3000
app.listen(PORT, "localhost", () => console.log("Listening on 3000..."));
