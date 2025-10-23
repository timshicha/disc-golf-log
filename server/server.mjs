import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import rateLimit from "express-rate-limit";
import fs from "fs";
import { configDotenv } from "dotenv";
import { registerGoogleAuthEndpoint } from "./auth/google.mjs";
import { registerGetDataEndpoint, registerGetModifiedDataEndpoint, registerPostDataEndpoint } from "./req/bulkData.mjs";
import { registerEmailAuthEndpoint } from "./auth/email.mjs";
import { registerChangeUsernameEndpoint } from "./req/usernames.mjs";
import { registerGetProfileCourseEndpoint, registerGetProfileEndpoint, registerUpdateProfileVisibility } from "./req/profile.mjs";
import { registerGetAllFriendsEndpoint, registerRemoveFriendEndpoint, registerRespondFriendRequestEndpoint, registerSendFriendRequestEndpoint, registerUndoSendFriendRequestEndpoint, registerGetAllFriendRequestsEndpoint, registerGetFriendRequestCountEndpoint } from "./req/friends.mjs";
import { registerLogoutEndpoint } from "./auth/logout.mjs";

configDotenv();
const PORT = process.env.PORT || 8080;
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME;
const CLIENT_HOSTNAME2 = process.env.CLIENT_HOSTNAME2;
const ENV = process.env.ENV;

const app = express();

const limiter = rateLimit({
    // Limit to 50 requests every 3 minutes (should be more than enough)
    windowMs: 3 * 60 * 1000,
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

// Auth endpoints
registerGoogleAuthEndpoint(app);
registerEmailAuthEndpoint(app);
registerLogoutEndpoint(app);

// Data related endpoints
registerPostDataEndpoint(app);
registerGetDataEndpoint(app);
registerGetModifiedDataEndpoint(app);

// Change username endpoint
registerChangeUsernameEndpoint(app);

// Profile related endpoints
registerGetProfileEndpoint(app);
registerUpdateProfileVisibility(app);
registerGetProfileCourseEndpoint(app);

// Friend related endpoints
registerSendFriendRequestEndpoint(app);
registerRespondFriendRequestEndpoint(app);
registerUndoSendFriendRequestEndpoint(app);
registerGetAllFriendsEndpoint(app);
registerRemoveFriendEndpoint(app);
registerGetAllFriendRequestsEndpoint(app);
registerGetFriendRequestCountEndpoint(app);

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
