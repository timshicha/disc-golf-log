import React from "react";
import ReactDOM from "react-dom/client";
import App from "./Jsx/App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./css/general.css";

const VERSION = import.meta.env.VITE_VERSION;

ReactDOM.createRoot(document.getElementById("root")).render(
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
    </GoogleOAuthProvider>
);