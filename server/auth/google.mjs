import { configDotenv } from "dotenv";
import https from "https";
import { parse } from "url";

configDotenv();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

// When the user logs in with Google in the front end, they get a code which
// is passed to the server. We use this function to convert the code for a
// Google token (which can then be used to get user data);
const exchangeGoogleCodeForToken = async (code) => {
    const token_result = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            code: code,
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: "postmessage",
            grant_type: "authorization_code"
        })
    });

    if(!token_result.ok) {
        throw new Error(`Google code to token exchange failed: ${await token_result.text()}`);
    }

    return token_result.json();
}

const fetchUserGoogleInfo = async (google_access_token) => {
    const user_result = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
        headers: {
            Authorization: `Bearer ${google_access_token}`
        }
    });

    if(!user_result.ok) {
        throw new Error(`Fetching Google user profile failed: ${await user_result.text()}`)
    }

    return user_result.json();
}

export { exchangeGoogleCodeForToken, fetchUserGoogleInfo };