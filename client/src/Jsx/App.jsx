import React, { useEffect, useState } from "react";
import MainPage from "./MainPage";
import SettingsPage from "./Settings";

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

    return (
        <>
            {currentPage === Pages.MAIN &&
                <MainPage navigateTo={navigateTo}></MainPage>
            }
            {currentPage === Pages.SETTINGS &&
                <SettingsPage navigateTo={navigateTo}></SettingsPage>
            }
        </>
    );
}

export default App;