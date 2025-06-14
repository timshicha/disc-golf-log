import React, { useState } from "react";
import DataHandler from "../../data_handling/data_handler";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import signInWithGoogleImg from "../../assets/images/signInWithGoogleIcon.png";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { replaceAllDataInCloud, retrieveAllDataFromCloud, uploadChangesToCloud } from "../../serverCalls/data.mjs";

// Once a user has been authenticated, we need to give them 3 options:
// 1) Keep both their current local data and data in the cloud
// 2) Keep just current data and delete the data they already have in the cloud
// 3) Keep just data in cloud and delete current local data

const MainLoginModal = (props) => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState({});

    const [selectedDataOption, setSelectedDataOption] = useState("both");


    const onGoogleLoginSuccess = async (data) => {
        const localData = await DataHandler.getAllData();
        console.log(localData);
        const hasLocalData = (localData.courses.length + localData.rounds.length) > 0;
        // If existing user and has local data, ask what to do with their data
        if(!data.isNewUser && hasLocalData) {
            setUserEmail(data.email);
            setUserData(data.data);
            setShowOptionModal(true);
        }
        // If only local data, push the data
        else if(hasLocalData) {
            // Replace all data in cloud with devide data
            DataHandler.replaceUpdateQueueWithCurrentData().then(() => {
                DataHandler.getQueue().then(async (data) => {
                    await uploadChangesToCloud(userEmail, data);
                    await DataHandler.clearUpdateQueue();
                    onLoginComplete(userEmail);
                });
            });
        }
        // Otherwise, upload their current data to cloud and finish login
        else {
            // Retrieve all data from cloud
            retrieveAllDataFromCloud().then(result => result.json()).then(result => {
                DataHandler.bulkAdd(result.courses, result.rounds).then(() => {
                    onLoginComplete(userEmail);
                    onLoginComplete(data.email, data.data);
                });
            });
        }
    }

    const onLoginComplete = (email) => {
        localStorage.setItem("email", email);
        setErrorMessage(null);
        setShowOptionModal(false);
        setUserEmail("");
        setUserData("");
        props.onLogin(email);
    }

    const onError = (error) => {
        setErrorMessage("Could not log in: " + error);
    }

    const onLoginConfirm = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        // If keeping device data...
        if(selectedDataOption === "device") {
            // Replace all data in cloud with devide data
            DataHandler.replaceUpdateQueueWithCurrentData().then(() => {
                DataHandler.getQueue().then(async (data) => {
                    await replaceAllDataInCloud(userEmail, data);
                    await DataHandler.clearUpdateQueue();
                    onLoginComplete(userEmail);
                });
            });
        }
        // If keeping cloud data...
        else if(selectedDataOption === "cloud") {
            // Retrieve all data from cloud
            await retrieveAllDataFromCloud().then(result => result.json()).then(result => {
                DataHandler.bulkAdd(result.courses, result.rounds);
            });
            onLoginComplete(userEmail);
        }
        // If keeping data from both...
        else {
            DataHandler.replaceUpdateQueueWithCurrentData().then(() => {
                DataHandler.getQueue().then(async (data) => {
                    // Upload local data to cloud
                    await uploadChangesToCloud(userEmail, data);
                    await DataHandler.clearUpdateQueue();
                    // Delete all data
                    await DataHandler.clearAllCoursesAndRounds();
                    // Pull data from cloud
                    await retrieveAllDataFromCloud().then(result => result.json()).then(result => {
                        DataHandler.bulkAdd(result.courses, result.rounds);
                    })
                    onLoginComplete(userEmail);
                });
            });
        }
    }


    return (
        <MenuModal className="pb-[20px]" onClose={props.onClose}>
            <ModalTitle>Login</ModalTitle>
            {/* IF NOT LOGGED IN YET */}
            {!showOptionModal && <>
            {errorMessage &&
                <div className="text-desc text-red-caution mt-[-10px] mb-[10px]">{errorMessage}</div>
            }
            <GoogleLoginButton onSuccess={onGoogleLoginSuccess} onError={onError}>
                <ModalButton>
                    <img src={signInWithGoogleImg} className="h-[130%]"></img>
                </ModalButton>
            </GoogleLoginButton>
            </>}
            {/* IF JUST LOGGED IN (GIVE THEM OPTIONS ON WHAT TO DO WITH DATA) */}
            {showOptionModal && <form onSubmit={onLoginConfirm} className="text-left mb-[0px]">
                <div className="text-desc text-gray-dark text-left text-[13px] mb-[15px]">It appears that you already have previous data in the cloud. What would you like to do with your data?</div>
                <div>
                    <input type="radio" name="data-option" id="keep-device-data-radio" onClick={() => setSelectedDataOption("device")} className=""></input>
                    <label htmlFor="keep-device-data-radio" className="ml-[5px] text-desc text-black text-[13px]">Keep device data only</label>
                </div>
                <div>
                    <input type="radio" name="data-option" id="keep-cloud-data-radio" onClick={() => setSelectedDataOption("cloud")} className=""></input>
                    <label htmlFor="keep-cloud-data-radio" className="ml-[5px] text-desc text-black text-[13px]">Keep cloud data only</label>
                </div>
                <div>
                    <input type="radio" defaultChecked={true} name="data-option" id="keep-both-data-radio" onClick={() => setSelectedDataOption("both")} className=""></input>                  
                    <label htmlFor="keep-both-data-radio" className="ml-[5px] text-desc text-black text-[13px]">Keep both data (try to marge)</label>
                </div>
                {/* Option description */}
                <div className="mt-[15px] text-desc text-gray-dark text-[13px] h-[90px] overflow-y-scroll">
                    {selectedDataOption === "device" &&
                    "All your data in the cloud will be deleted and replaced by what is currently on this device."}
                    {selectedDataOption === "cloud" &&
                    "All the data on this device will be deleted and replaced by your data in the cloud."}
                    {selectedDataOption === "both" &&
                    "We will attempt to merge and keep the data both on this device and the data in the cloud. The merged data will be added to this device and to the cloud."}
                </div>
                <div className="text-center">
                    <ModalButton className="bg-blue-basic text-white">Confirm</ModalButton>
                </div>
            </form>}
        </MenuModal>
    );
}

export default MainLoginModal;