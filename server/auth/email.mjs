
// If a user wants to log in with email, send a code to that email
/**
 * @param {import("express").Express} app 
 */
const registerEmailAuthEndpoint = (app) => {
    // If logging in (user wants a token)
    app.post("/auth/email", async (req, res) => {
        const email = req.body?.email;
        const code = req.body?.code;

        // If an email was provided, send that email a code.
        // If a code was provided, confirm that the code is valid
        // and return a token.

        // If email
        if(email) {
            // Send email
            res.status(200).json({res: "received your email"});
        }
        // If code
        else if(code){
            res.status(200).json({res: "received your code"});
        }
        // If neither
        else {
            res.status(200).json({res: "neither was sent"});
        }
    });
}



export { registerEmailAuthEndpoint };
    