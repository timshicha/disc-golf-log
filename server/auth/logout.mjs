import { tokenOptions } from "./tokens.mjs";

/**
 * @param {import("express").Express} app 
 */
const registerLogoutEndpoint = (app) => {
    // If logging in (user wants a token)
    app.get("/logout", async (req, res) => {
        console.log("Logout:", req.cookies.token);
    
        try {
            res.clearCookie("token", tokenOptions);
            res.status(200).json({ success: true });
        } catch (error) {
            res.status(500).send("Server error.");
        }
    });
}

export { registerLogoutEndpoint };