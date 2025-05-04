import { configDotenv } from "dotenv";
import https from "https";
import { parse } from "url";

configDotenv();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// When the user logs in with Google in the front end, they get a code which
// is passed to the server. We use this function to convert the code for a
// Google token (which can then be used to get user data);
const exchangeGoogleCodeForToken = (code) => {
    return new Promise((resolve, reject) => {
        // Data to pass to Google API
        const data = new URLSearchParams({
            code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: "postmessage",
            grant_type: "authorization_code"
        }).toString();

        // Send request to Google API
        const req = https.request(
            {
                method: "POST",
                hostname: "oauth2.googleapis.com",
                path: "/token",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Content-Length": Buffer.byteLength(data)
                }
            },
            (res) => {
                let body = "";
                res.on("data", (chunk) => (body += chunk));
                res.on("end", () => {
                    if(res.statusCode >= 400) return reject(body);
                    resolve(JSON.parse(body));
                });
            }
        );

        req.on("error", reject);
        req.write(data);
        req.end();
    });
}

const fetchUserGoogleInfo = (google_access_token) => {
    return new PromiseRejectionEvent((resolve, reject) => {
        https.get(
            `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`,
            (res) => {
                let body = "";
                res.on("data", (chunk) => (body += chunk));
                res.on("end", () => {
                    if(res.statusCode >= 400) {
                        return reject(body);
                    }
                });
            }
        ).on("error", reject);
    });
}

export { exchangeGoogleCodeForToken, fetchUserGoogleInfo };