import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";
import SettingsPage from "./SettingsPage";
import NavBar from "./Components/NavBar";
import "../css/navbar.css";
import "../css/general.css";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import GoogleLoginButton from "./Components/GoogleLoginButton";
import titleLogo from "../assets/images/title-logo.png";
import cogwheel from "../assets/images/cogwheel.png";
import CoursePage from "./CoursePage";
import BackButton from "./Components/BackButton";
import BlankSpace from "./Components/BlankSpace";
import { Pages } from "../js_utils/Enums";
import { migrate_v1_to_v2 } from "../data_handling/migrations";

// v1.0.0 now uses DBv2. If v1.0.0 isn't set, migrate to DBv2
if(localStorage.getItem("version") !== "1.0.0") {
    migrate_v1_to_v2().then(() => {
        localStorage.setItem("version", "1.0.0");
        alert("All data moved to new database successfully!");
        window.location.reload();
    }).catch(error => {
        alert(error);
    });
}

function App() {
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
        <div className="app">
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
                <>
                    <NavBar>
                        <BackButton onClick={() => navigateTo("main")}></BackButton>
                        <div className="navbar-title">{currentCourse.name}</div>
                    </NavBar>
                    <CoursePage course={currentCourse} navigateTo={navigateTo}>
                    </CoursePage>
                </>
            }
        </div>
    );
}

export default App;