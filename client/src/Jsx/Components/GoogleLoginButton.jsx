import React from "react";
const SERVER_URI = import.meta.env.VITE_SERVER_URI;
import { useGoogleLogin } from "@react-oauth/google";

const GoogleLoginButton = (props) => {

    // Show Google login screen, and when user logs in, returns a code
    const login = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (tokenResponse) => {
            const { code } = tokenResponse;
            let result;
            let status;

            try {
                result = await fetch(SERVER_URI + "/auth/google", {
                    method: "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ code })
                }).catch(error => {
                    console.log(error);
                });
                if(!result.ok) {
                    status = result.status;
                    throw new Error (`HTTP request failed with status ${result.status}.`);
                }
                else {
                    result = await result.json();
                }
            } catch (error) {
                if(status === 500) {
                    error = "An error occured in the server. (Not your fault)."
                }
                else if(status === 401) {
                    error = "Invalid Google token provided."
                }
                else {
                    error = "An error occured."
                }
                props.onSubmit({
                    success: false,
                    error: error
                });
                return;
            }
            props.onSubmit({
                success: true,
                data: result
            });
            return;
        },
        onError: (error) => {
            props.onSubmit({
                success: false,
                error: "An error occured."
            });
            return;
        },
        // redirect_uri: "postmessage",
        scope: "email profile"
    });

    return (
        <button onClick={login} className={props.className}>{props.children}</button>
    );
}

export default GoogleLoginButton;