import React from "react";
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = (props) => {

    // Show Google login screen, and when user logs in, returns a code
    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: (tokenResponse) => {
            const { code } = tokenResponse;

            try {
                fetch("http://localhost:3000/auth/google", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ code })
                }).then(res => res.json()).then(data => {
                    data = JSON.parse(data.message);
                    props.onSuccess(data);
                });
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
        <div onClick={login}>{props.children}</div>
    );
}

export default GoogleLoginButton;