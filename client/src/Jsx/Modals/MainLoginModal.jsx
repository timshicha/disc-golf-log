import React, { useState } from "react";
import DataHandler from "../../data_handling/data_handler";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import googleIcon from "../../assets/images/googleIcon.png";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { retrieveAllDataFromCloud, uploadQueueToCloud } from "../../serverCalls/data.mjs";
import { Modals } from "../../js_utils/Enums";
import { httpRequestEmailCode, httpConfirmEmailCode } from "../../serverCalls/auth.mjs";

// Once a user has been authenticated, we need to give them 3 options:
// 1) Keep both their current local data and data in the cloud
// 2) Keep just current data and delete the data they already have in the cloud
// 3) Keep just data in cloud and delete current local data

const MainLoginModal = (props) => {

    const [showOptionModal, setShowOptionModal] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [userData, setUserData] = useState({});
    const [confirmLoginLoading, setConfirmLoginLoading] = useState(false);
    const [sendCodeLoading, setSendCodeLoading] = useState(false);
    const [codeLoginLoading, setCodeLoginLoading] = useState(false);
    const [currentSubmodal, setCurrentSubmodal] = useState(null);
    const [modalXImg, setModalXImg] = useState("");
    const [mainLoginError, setMainLoginError] = useState(null);
    const [loginWithCodeError, setLoginWithCodeError] = useState(null);

    // "local", "cloud", or "both"
    const [selectedDataOption, setSelectedDataOption] = useState("both");
    const [email, setEmail] = useState(null);

    const onLoginAttempt = async (result) => {
        // On successful login:
        // {success: true,
        //  data: {email: "...", data: "{...}", isNewUser: true/false}
        // }
        if(result.success) {
            setUserEmail(result.data.email);
            setUserData(result.data.data);
            // If a new user, default to keeping device data
            if(result.data.isNewUser === true) {
                setSelectedDataOption("local");
                await onLoginHandleData("local", result.data.email, result.data.data);
            }
            else {
                const localData = await DataHandler.getAllData();
                // If there are no local courses (and no rounds)
                if(localData.courses.length === 0) {
                    setSelectedDataOption("cloud");
                    await onLoginHandleData("cloud", result.data.email, result.data.data);
                }
            }
            // Otherwise, it's not a new user and they have data, so
            // let them decide what to do with their data
            setShowOptionModal(true);
        }
        else {
            alert("Could not log in");
            console.log(result);
        }
    }

    const onLoginComplete = (email) => {
        localStorage.setItem("email", email);
        localStorage.setItem("last-pushed-to-cloud", Date ());
        setMainLoginError(null);
        setShowOptionModal(false);
        setUserEmail("");
        setUserData("");
        props.onLogin(email);
    }

    const onLoginConfirm = async (event) => {
        setConfirmLoginLoading(true);
        event.preventDefault();
        event.stopPropagation();

        await onLoginHandleData(selectedDataOption, userEmail, userData);
        setConfirmLoginLoading(false);
    }

    const onLoginHandleData = async (dataOption, email, data) => {
        let result;
        // If keeping device data...
        if(dataOption === "local") {
            // Replace all data in cloud with devide data
            result = await uploadQueueToCloud(email, true);
        }
        // If keeping cloud data...
        else if(dataOption === "cloud") {
            // Retrieve all data from cloud
            result = await retrieveAllDataFromCloud(email);
        }
        // If keeping data from both...
        else {
            // First pull the data from the server
            result = await retrieveAllDataFromCloud(email);
            // Now push the local data to server
            if(result.success) {
                const cloudData = result.data;
                await DataHandler.replaceUpdateQueueWithCurrentData();
                result = await uploadQueueToCloud(email, false);
                if(result.success) {
                    await DataHandler.bulkAdd(cloudData.courses, cloudData.rounds);
                }
            }
        }
        if(result.success) {
            onLoginComplete(email);
        }
        else {
            console.log(result);
        }
    }

    const sendCode = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMainLoginError(null);

        setSendCodeLoading(true);
        const email = event?.target?.email?.value;
        setEmail(email);
        // const result = { success: true};
        const result = await httpRequestEmailCode(email);
        // When code has been sent, show code modal
        if(result.success === true) {
            setModalXImg("back-arrow");
            setCurrentSubmodal(Modals.LOGIN_CODE_MODAL);
        }
        else {
            setMainLoginError("Error sending email.");
        }
        setSendCodeLoading(false);
    }

    const onCodeSubmit = async (event) => {
        event.preventDefault();
        event.stopPropagation();

        setCodeLoginLoading(true);
        const code = event?.target?.code?.value;
        if(!code) {
            setLoginWithCodeError("Please enter a code!");
            setCodeLoginLoading(false);
        }
        // Confirm that the code is correct
        const result = await httpConfirmEmailCode(email, event?.target?.code?.value);
        if(result.success) {
            console.log("Login is successful!");
        }
        else {
            setLoginWithCodeError(result.error);
        }
        setCodeLoginLoading(false);
    }

    const onBack = () => {
        if(currentSubmodal) {
            setModalXImg(null);
            setCurrentSubmodal(null);
            setSendCodeLoading(null);
            setCodeLoginLoading(null);
            setMainLoginError(null);
            setLoginWithCodeError(null);
        }
        else {
            onClose();
        }
    }

    const onClose = () => {
        props.onClose();
        setCurrentSubmodal(null);
        setSendCodeLoading(null);
        setCodeLoginLoading(null);
        setMainLoginError(null);
        setLoginWithCodeError(null);
    }



    return (
        <MenuModal className="pb-[20px]" onClose={onClose} onBack={onBack} replaceImg={modalXImg}>
            <ModalTitle>Login</ModalTitle>


                {/* IF NOT LOGGED IN YET */}
                {!showOptionModal &&
                <>
                    {/* IF ON MAIN LOGIN MODAL */}
                    {!currentSubmodal &&
                    <>
                        {mainLoginError &&
                        <div className="text-desc text-red-caution text-[13px]">{mainLoginError}</div>
                        }
                        <form className="w-[90%] text-left mx-auto" onSubmit={sendCode}>
                            <label htmlFor="login-email-input" className="text-left text-[13px] text-gray-dark">Email:</label>
                            <input id="login-email-input" name="email" type="email" className="mb-[10px] w-[100%]" placeholder="example@email.com">
                            </input>
                            <div className="text-center">
                                <ModalButton loading={sendCodeLoading} type="submit" className="bg-blue-basic text-white block">Send Code</ModalButton>
                            </div>
                        </form>
                            
                        <hr className="text-gray-mild mt-[10px]"></hr>
                        <div className="text-desc text-gray-dark text-[12px] mb-[15px]">Or log in another way</div>
                        <GoogleLoginButton onSubmit={onLoginAttempt} className="inline-block w-[40px]">
                            <img className="w-[40px]" src={googleIcon}></img>
                        </GoogleLoginButton>
                    </>}
                    
                    {/* IF ON CODE INPUT MODAL */}
                    {currentSubmodal === Modals.LOGIN_CODE_MODAL &&
                    <>
                        <form className="text-left w-[150px] max-w-[90%] mx-auto" onSubmit={onCodeSubmit}>
                            <label htmlFor="login-code-input" className="text-desc text-[13px] text-gray-dark block">Code:</label>
                            <input id="login-code-input" name="code" inputMode="numeric" className="block w-[100%] text-center" placeholder="000000" maxLength={6}></input>
                            <div className="text-center">
                            {loginWithCodeError &&
                                <div className="text-desc mt-[10px] text-red-caution text-[13px]">{loginWithCodeError}</div>
                            }
                                <ModalButton loading={codeLoginLoading} className="bg-blue-basic text-white mt-[10px]">Login</ModalButton>
                            </div>
                        </form>
                    </>}
                </>}


                {/* IF JUST LOGGED IN (GIVE THEM OPTIONS ON WHAT TO DO WITH DATA) */}
                {showOptionModal && <form onSubmit={onLoginConfirm} className="text-left mb-[0px]">
                    <div className="text-desc text-gray-dark text-left text-[13px] mb-[15px]">It appears that you already have previous data in the cloud. What would you like to do with your data?</div>
                    <div>
                        <input type="radio" name="data-option" id="keep-device-data-radio" onClick={() => setSelectedDataOption("local")} className=""></input>
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
                        {selectedDataOption === "local" &&
                        "All your data in the cloud will be deleted and replaced by what is currently on this device."}
                        {selectedDataOption === "cloud" &&
                        "All the data on this device will be deleted and replaced by your data in the cloud."}
                        {selectedDataOption === "both" &&
                        "We will attempt to merge and keep the data both on this device and the data in the cloud. The merged data will be added to this device and to the cloud."}
                    </div>
                    <div className="text-center">
                        <ModalButton loading={confirmLoginLoading} className="bg-blue-basic text-white">Confirm</ModalButton>
                    </div>
                </form>}
        </MenuModal>
    );
}

export default MainLoginModal;