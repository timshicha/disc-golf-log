import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = () => {

    // Show Google login screen, and when user logs in, returns a code
    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (tokenResponse) => {
            const { code } = tokenResponse;

            try {
                const res = await fetch("http://localhost:3000/auth/google", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ code })
                });

                const data = await res.json();
                console.log("User info:", data);
            } catch (error) {
                console.log("Login failed:", error);
            }
        },
        onError: () => {
            console.log("Login failed.");
        },
        // redirect_uri: "postmessage",
        scope: "email profile"
    });

    return (
        <button onClick={login}>Sign in with Google</button>
    );
}

export default GoogleLoginButton;