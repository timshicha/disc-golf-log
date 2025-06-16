import { configDotenv } from "dotenv";
import { addUser, findUserByEmail } from "../db/users.mjs";
import { generateToken } from "./tokens.mjs";
const ENV = process.env.ENV;

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

/**
 * @param {import("express").Express} app 
 */
const registerGoogleAuthEndpoint = (app) => {
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
    
        let isNewUser = false;
        // Find user by email
        let user = await findUserByEmail(google_profile.email);
        // If user doesn't exist, add them
        if(!user) {
            isNewUser = true;
            await addUser(google_profile.email, {});
            user = {
                email: google_profile.email,
                data: {}
            };
        }
    
        const token = await generateToken(google_profile.email);
        // If a token was generated, set as a cookie
        if(token) {
            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "None",
                path: "/"
            });
            console.log("Token set: " + token);
        }
        
        res.status(200).json({
            email: user.email,
            data: user.data,
            isNewUser: isNewUser
        });
    });
}

export { exchangeGoogleCodeForToken, fetchUserGoogleInfo, registerGoogleAuthEndpoint };