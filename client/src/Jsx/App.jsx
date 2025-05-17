import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";
import SettingsPage from "./Settings";
import NavBar from "./Components/NavBar";
import "../css/navbar.css";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import GoogleLoginButton from "./Components/GoogleLoginButton";
import titleLogo from "../assets/images/title-logo.png";
import cogwheel from "../assets/images/cogwheel.png";



function App() {

    const Pages = {
        MAIN: "main",
        SETTINGS: "settings"
    }
    const [currentPage, setCurrentPage] =  useState(Pages.MAIN);

    useEffect(() => {
    }, []);

    const navigateTo = (newPage) => {
        if(newPage === "settings") {
            setCurrentPage(Pages.SETTINGS);
        }
        else {
            setCurrentPage(Pages.MAIN);
        }
    }

    const onGoogleLoginSuccess = (data) => {
        for (let key in data) {
            console.log(key + ": " + data[key]);
        }

        localStorage.setItem("signed-in-email", data.email);
    }

    return (
        <>
            {currentPage === Pages.MAIN &&
            <>
                <NavBar>
                    <img src={titleLogo} className="navbar-title-logo"></img>
                    <div className="navbar-right-items">
                        <GoogleLoginButton onSuccess={onGoogleLoginSuccess}>
                            <ModalButton className="login-button">Sign in</ModalButton>
                        </GoogleLoginButton>
                        <button className="navbar-hamburger-button" onClick={() => {
                            navigateTo("settings");
                        }}>
                            <img src={cogwheel}></img>
                        </button>
                    </div>
                </NavBar>
                <MainPage navigateTo={navigateTo}></MainPage>
            </>
            }
            {currentPage === Pages.SETTINGS &&
                <>
                <NavBar></NavBar>
                    <SettingsPage navigateTo={navigateTo}></SettingsPage>

                </>
            }
        </>
    );
}

export default App;