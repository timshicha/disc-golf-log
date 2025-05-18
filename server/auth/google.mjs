import { configDotenv } from "dotenv";
import { addUser, findUserByEmail } from "../db/users.mjs";
import { generateToken } from "./tokens.mjs";

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

const handleGoogleLoginRequest = async (req, res) => {
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

    // Find user by email
    let user = await findUserByEmail(google_profile.email);
    // If user doesn't exist, add them
    if(!user) {
        user = await addUser(google_profile.email, google_profile.name);
    }

    const token = await generateToken(google_profile.email);
    // If a token was generated, set as a cookie
    if(token) {
        res.cookie("token", token, {
            secure: false
        });
        console.log("Token set: " + token);
    }

    res.status(200).json({
        message: JSON.stringify(user)
    });
}

export { exchangeGoogleCodeForToken, fetchUserGoogleInfo, handleGoogleLoginRequest };