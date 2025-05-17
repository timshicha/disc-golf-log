import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";
import SettingsPage from "./SettingsPage";
import NavBar from "./Components/NavBar";
import "../css/navbar.css";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import GoogleLoginButton from "./Components/GoogleLoginButton";
import titleLogo from "../assets/images/title-logo.png";
import cogwheel from "../assets/images/cogwheel.png";
import CoursePage from "./CoursePage";
import BackButton from "./Components/BackButton";
import BlankSpace from "./Components/BlankSpace";



function App() {

    const Pages = {
        MAIN: "main",
        SETTINGS: "settings",
        COURSE: "course"
    }
    const [currentPage, setCurrentPage] =  useState(Pages.MAIN);
    const [currentCourse, setCurrentCourse] = useState(null);

    useEffect(() => {
    }, []);

    const navigateTo = (newPage) => {
        if(newPage === "settings") {
            setCurrentPage(Pages.SETTINGS);
        }
        else if(newPage === "course") {
            setCurrentPage(Pages.COURSE);
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
                        <button className="navbar-settings-button" onClick={() => {
                            navigateTo("settings");
                        }}>
                            <img src={cogwheel}></img>
                        </button>
                    </div>
                </NavBar>
                {/* Add spacer to account for navbar which doesn't
                take up any space. */}
                <BlankSpace height="50px"></BlankSpace>
                <MainPage navigateTo={navigateTo} setCurrentCourse={setCurrentCourse}></MainPage>
            </>
            }
            {currentPage === Pages.SETTINGS &&
                <>
                    <NavBar>
                        <BackButton onClick={() => navigateTo("main")}></BackButton>
                        <div className="navbar-title">Settings</div>
                    </NavBar>
                    <SettingsPage navigateTo={navigateTo}></SettingsPage>

                </>
            }
            {currentPage === Pages.COURSE &&
                <CoursePage course={currentCourse} navigateTo={navigateTo}>
                </CoursePage>
            }
        </>
    );
}

export default App;