import express from "express";
import cors from "cors";
import { configDotenv } from "dotenv";
import { exchangeGoogleCodeForToken, fetchUserGoogleInfo, handleGoogleLoginRequest } from "./auth/google.mjs";

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
    handleGoogleLoginRequest(req, res);
});

// starts a simple http server locally on port 3000
app.listen(PORT, "localhost", () => console.log("Listening on 3000..."));
