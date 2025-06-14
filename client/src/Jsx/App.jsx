import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";
import SettingsPage from "./SettingsPage";
import NavBar, { NavBarBackButton, NavBarTitle } from "./Components/NavBar";
import "../css/general.css";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import GoogleLoginButton from "./Components/GoogleLoginButton";
import titleLogo from "../assets/images/title-logo.png";
import cogwheel from "../assets/images/cogwheel.png";
import CoursePage from "./CoursePage";
import { Pages } from "../js_utils/Enums";
import { migrate_v1_to_v2 } from "../data_handling/migrations";
import { version as currentVersion } from "../../package.json";
import { isVersionBehind } from "../js_utils/sorting";

// See what version of the software the user currently has. If they haven't
// used the app, simply give then the current version
let version = localStorage.getItem("version") || currentVersion;
console.log(version);

// v1.0.0 now uses DBv2. If v1.0.0 isn't set, migrate to DBv2
if(isVersionBehind(version, "1.0.0")) {
    migrate_v1_to_v2().then(() => {
        localStorage.setItem("version", "1.0.0");
        alert("All data moved to new database successfully!");
        version = "1.0.0";
        window.location.reload();
    }).catch(error => {
        alert(error);
    });
}

// v1.0.1 update
if(isVersionBehind(version, "1.0.1")) {
    console.log("here")
    // In this version, we are adding some setting preferences
    localStorage.setItem("confirm-delete", true);
    localStorage.setItem("version", "1.0.1");
    version = "1.0.1";
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
        <div className="overflow-hidden">
            {currentPage === Pages.MAIN &&
            <>
                <NavBar>
                    <NavBarTitle>My Courses</NavBarTitle>
                    <img src={titleLogo} className="h-[40px]"></img>
                    <div className="flex">
                        <button className="w-[42px] h-[42px] bg-black mx-[5px] rounded-[7px] cursor-pointer" onClick={() => {
                            navigateTo("settings");
                        }}>
                            <img className="h-[42px] w-[42px]" src={cogwheel}></img>
                        </button>
                    </div>
                </NavBar>
                {/* Add spacer to account for navbar which doesn't
                take up any space. */}
                <div className="h-[42px]"></div>
                <MainPage navigateTo={navigateTo} setCurrentCourse={setCurrentCourse}></MainPage>
            </>
            }
            {currentPage === Pages.SETTINGS &&
                <>
                    <NavBar>
                        <div className="absolute ml-[100%] translate-x-[calc(-100%-7px)] absolute">
                            {/* <ModalButton className="bg-black text-white">Save</ModalButton> */}
                        </div>
                        <NavBarTitle>Settings</NavBarTitle>
                        <NavBarBackButton onClick={() => navigateTo("main")}></NavBarBackButton>
                    </NavBar>
                    <SettingsPage navigateTo={navigateTo}></SettingsPage>
                </>
            }
            {currentPage === Pages.COURSE &&
                <>
                    <NavBar>
                        <NavBarBackButton onClick={() => navigateTo("main")}></NavBarBackButton>
                        <div className="absolute w-[calc(100%-70px)] ml-[50px] mt-[10px] h-[20px] text-center text-[15px] font-bold truncate">{currentCourse.name}</div>
                    </NavBar>
                    <CoursePage course={currentCourse} navigateTo={navigateTo}>
                    </CoursePage>
                </>
            }
        </div>
    );
}

export default App;