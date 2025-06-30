import React, { useEffect, useState } from "react";
import MainPage from "./Pages/MainPage";
import SettingsPage from "./Pages/SettingsPage";
import NavBar, { NavBarBackButton, NavBarTitle } from "./Jsx/Components/NavBar";
import titleLogo from "./assets/images/title-logo.png";
import cogwheel from "./assets/images/cogwheel.png";
import socialIcon from "./assets/images/socialIcon.png";
import CoursePage from "./Pages/CoursePage";
import { Modals, Pages } from "./Utilities/Enums";
import { version as currentVersion } from "../package.json";
import { isVersionBehind } from "./Utilities/sorting";
import { httpUploadQueueToCloud } from "./ServerCalls/data.mjs";
import SocialModal from "./Jsx/Modals/SocialModal";

// See what version of the software the user currently has. If they haven't
// used the app, simply give then the current version
let version = localStorage.getItem("version") || "0.0.0";

// v1.0.1 update
// Confirm delete default = true
if(isVersionBehind(version, "1.1.1")) {
    localStorage.setItem("confirm-delete", true);
}
// v1.0.5 update
// Auto scroll to bottom of the page when opening a course
if(isVersionBehind(version, "1.1.5")) {
    localStorage.setItem("auto-scroll-to-bottom-on-course-open", true);
}

localStorage.setItem("version", currentVersion);

// If the user is logged in
const email = localStorage.getItem("email");
if(email) {
    const lastUpdated = localStorage.getItem("last-pushed-to-cloud") || 0;
    // If the last time changes were updated to cloud was over an hour
    // ago, push changes to cloud (if there are changes)
    const updateInterval = 1000 * 60 * 60;
    if(new Date() - new Date(lastUpdated) >= updateInterval) {
        httpUploadQueueToCloud(email).then(result => {
            if(result.success === true) {
                localStorage.setItem("last-pushed-to-cloud", Date ());
            }
            // If the user failed to log in because of credentials,
            // log them out
            else if(result.status === 401) {
                localStorage.removeItem("email");
            }
        });
    }
}

function App() {
    const [currentPage, setCurrentPage] =  useState(Pages.MAIN);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentModal, setCurrentModal] = useState(null);

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

    return (
        <div className="overflow-hidden">
            {currentModal === Modals.SOCIAL &&
            <SocialModal onClose={() => {setCurrentModal(null)}} username={localStorage.getItem("username")}>
            </SocialModal>}
            {currentPage === Pages.MAIN &&
            <>
                <NavBar>
                    <NavBarTitle>My Courses</NavBarTitle>
                    <div className="flex">
                        <button className="absolute left-[0px] w-[42px] h-[42px] bg-black mx-[5px] rounded-[7px] cursor-pointer" onClick={() => {
                            setCurrentModal(Modals.SOCIAL);
                        }}>
                            <img className="h-[42px] w-[42px]" src={socialIcon}></img>
                        </button>
                        <button className="absolute right-[0px] w-[42px] h-[42px] bg-black mx-[5px] rounded-[7px] cursor-pointer" onClick={() => {
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
                        <div className="absolute w-[calc(100%-110px)] ml-[55px] mt-[10px] h-[20px] text-center text-[15px] font-bold truncate">{currentCourse.name}</div>
                    </NavBar>
                    <CoursePage course={currentCourse} navigateTo={navigateTo}>
                    </CoursePage>
                </>
            }
        </div>
    );
}

export default App;