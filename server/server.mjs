import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { exchangeGoogleCodeForToken, fetchUserGoogleInfo } from "./auth/google.mjs";

configDotenv();
const HOST = process.env.HOST;
const PORT = process.env.PORT;
const ENV = process.env.ENV
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME

const app = express();
app.use(cors({
    origin: ENV === "dev" ? "*" : CLIENT_HOSTNAME,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// If logging in (user wants a token)
app.post("/auth/google", async (req, res) => {
    const { code } = req.body;

    if(!code) {
        return res.status(400).json({
            error: "Missing code"
        });
    }
    const google_access_token = await exchangeGoogleCodeForToken(code);
    if(!google_access_token) {
        res.status(400).json({
            error: "Invalid Google token"
        });
    }
    // Must use google_access_token.access_token because it's a
    // json of items.
    const google_profile = await fetchUserGoogleInfo(google_access_token.access_token);

    res.status(200).json({
        message: JSON.stringify(google_profile)
    });
});

// starts a simple http server locally on port 3000
app.listen(PORT, "localhost", () => console.log("Listening on 3000..."));
