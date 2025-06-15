import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import https from "https";
import fs from "fs";
import { configDotenv } from "dotenv";
import { registerGoogleAuthEndpoint } from "./auth/google.mjs";
import { registerGetDataEndpoint, registerPostDataEndpoint } from "./req/bulkData.mjs";

configDotenv();
const PORT = process.env.PORT || 8080;
const CLIENT_HOSTNAME = process.env.CLIENT_HOSTNAME;
const ENV = process.env.ENV;

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
registerGoogleAuthEndpoint(app);

// If the user sends a list of modifications
registerPostDataEndpoint(app);

// If the user wants to get all their data from the cloud (such as when logging in)
registerGetDataEndpoint(app);

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
