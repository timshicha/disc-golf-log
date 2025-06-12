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
                }).then(res => {
                    if(!res.ok) {
                        props.onError("Code " + res.status);
                    }
                    return res.json();
                }).then(data => {
                    props.onSuccess(data)
                }).catch(error => {
                    console.log(error);
                    props.onError("Server Error");
                })
            } catch (error) {
                console.log(error);
                props.onError(error);
            }
        },
        onError: (error) => {
            console.log(error);
            props.onError();
        },
        // redirect_uri: "postmessage",
        scope: "email profile"
    });

    return (
        <div onClick={login}>{props.children}</div>
    );
}

export default GoogleLoginButton;