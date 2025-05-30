import React, { useState } from "react";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import signInWithGoogleImg from "../../assets/images/signInWithGoogleIcon.png";
import GoogleLoginButton from "../Components/GoogleLoginButton";


const MainLoginModal = (props) => {

    const [errorMessage, setErrorMessage] = useState(null);

    const onGoogleLoginSuccess = (data) => {
        console.log(data);

        props.onLogin(data.email);
    }

    const onError = (error) => {
        setErrorMessage("Could not log in: " + error);
    }


    return (
        <MenuModal className="pb-[30px]" onClose={props.onClose}>
            <ModalTitle>Login</ModalTitle>
            {errorMessage &&
                <div className="text-desc text-red-caution mt-[-10px] mb-[10px]">{errorMessage}</div>
            }
            <GoogleLoginButton onSuccess={onGoogleLoginSuccess} onError={onError}>
                <ModalButton>
                    <img src={signInWithGoogleImg} className="h-[130%]"></img>
                </ModalButton>
            </GoogleLoginButton>
        </MenuModal>
    );
}

export default MainLoginModal;