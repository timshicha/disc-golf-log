import { createServer } from "node:http";
import { configDotenv } from "dotenv";
import { loginAndGetToken } from "./req/users.mjs";

configDotenv();
const HOST = process.env.HOST;
const PORT = process.env.PORT;

const server = createServer (async (req, res) => {
    console.log(req.url);

    // Separate url path and url parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    req.pathname = url.pathname;
    req.email = url.searchParams.get("email");

    // If logging in (user wants a token)
    if(req.method === "GET" && req.pathname === "/token") {
        await loginAndGetToken(req, res);
    }
    // If not a valid request
    else {
        res.writeHead(400);
        res.end(JSON.stringify({
            error: "Invalid request!"
        }));
    }
});

// starts a simple http server locally on port 3000
server.listen(PORT, HOST, () => {
    console.log(`Listening at ${HOST}:${PORT}...`);
});
