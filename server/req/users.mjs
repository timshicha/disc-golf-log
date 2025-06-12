import { findUserByEmail } from "../db/users.mjs";

// Handle an http user login
const loginAndGetToken = async (req, res) => {
    try {
        // If no email provided, error
        if(!req.email) {
            console.log("Email not provided");
            res.writeHead(401);
            res.end(JSON.stringify({
                error: "Email not provided!"
            }));
            return;
        }
        // Find the user in the database
        const user = await findUserByEmail(req.email);
        res.writeHead(200);
        res.end(JSON.stringify(user));

    } catch {(error) => {
        res.writeHead(401);
        res.end(JSON.stringify({
            error: error
        }));
    }};
};

export { loginAndGetToken };