import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import rateLimit from "express-rate-limit";
import fs from "fs";
import { configDotenv } from "dotenv";
import { registerGoogleAuthEndpoint } from "./auth/google.mjs";
import { registerGetDataEndpoint, registerPostDataEndpoint } from "./req/bulkData.mjs";
import { registerEmailAuthEndpoint } from "./auth/email.mjs";
import { registerChangeUsernameEndpoint } from "./req/usernames.mjs";

configDotenv();
const PORT = process.env.PORT || 8080;
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME;
const CLIENT_HOSTNAME2 = process.env.CLIENT_HOSTNAME2;
const ENV = process.env.ENV;

const app = express();

const limiter = rateLimit({
    // Limit to 50 requests every 10 minutes (should be more than enough)
    windowMs: 10 * 60 * 1000,
    limit: 50,
    // Don't show info on max limits to prevent spamming
    standardHeaders: false,
    legacyHeaders: false
});

const whitelist = [CLIENT_HOSTNAME, CLIENT_HOSTNAME2];

const corsOptions = {
    origin: (origin, callback) => {
        if(!origin || whitelist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS."));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};
app.use(cors(corsOptions));
app.use(limiter); // Request rate limit
app.use(express.json({ limit: '1mb' })); // Limit incoming data to 1MB
app.options("/", cors(corsOptions));

app.use(express.json()); // Automatically parse body when json
app.use(cookieParser()); // Automatically parse cookies

app.get("/ready", async (req, res) => {
    res.status(200).send("Server is ready.");
});

// If logging in with Google (user wants a token)
registerGoogleAuthEndpoint(app);
// If logging in with email (either email or code from email)
registerEmailAuthEndpoint(app);

// If the user sends a list of modifications
registerPostDataEndpoint(app);

// If the user wants to get all their data from the cloud (such as when logging in)
registerGetDataEndpoint(app);

// If the user wants to change thier username
registerChangeUsernameEndpoint(app);

// If on localhost, manually set up to listen via https
if(ENV === "localhost") {
    const httpsCredentials = {
        key: fs.readFileSync("localhost-key.pem"),
        cert: fs.readFileSync("localhost.pem")
    };
    https.createServer(httpsCredentials, app).listen(PORT, () => {
        console.log("--------------------------------------------------");
        console.log("");
        console.log("SERVER STARTED!");
        console.log(`Port: ${PORT}`);
        console.log(`Accepting requests from: ${CLIENT_HOSTNAME}`);
        console.log(`Environment: ${process.env.ENV}`);
        console.log(`DB schema: ${process.env.DB_SCHEMA}`);
        console.log("");
        console.log("--------------------------------------------------");
    });
}
// If not on localhost (production environment)
else {
    app.listen(PORT, "0.0.0.0", () => {
        console.log("--------------------------------------------------");
        console.log("");
        console.log("SERVER STARTED!");
        console.log(`Port: ${PORT}`);
        console.log(`Accepting requests from: ${CLIENT_HOSTNAME}`);
        console.log(`Environment: ${process.env.ENV}`);
        console.log(`DB schema: ${process.env.DB_SCHEMA}`);
        console.log("");
        console.log("--------------------------------------------------");
    });
}
