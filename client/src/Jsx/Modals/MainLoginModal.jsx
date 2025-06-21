import React, { useState } from "react";
import DataHandler from "../../DataHandling/DataHandler";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import googleIcon from "../../assets/images/googleIcon.png";
import GoogleLoginButton from "../Components/GoogleLoginButton";
import { httpRetrieveAllDataFromCloud, httpUploadQueueToCloud } from "../../serverCalls/data.mjs";
import { Modals } from "../../Utilities/Enums";
import { httpRequestEmailCode, httpConfirmEmailCode } from "../../serverCalls/auth.mjs";
import LoadingImg from "../Components/LoadingImg";

// Once a user has been authenticated, we need to give them 3 options:
// 1) Keep both their current local data and data in the cloud
// 2) Keep just current data and delete the data they already have in the cloud
// 3) Keep just data in cloud and delete current local data

const MainLoginModal = (props) => {

    const [loading, setLoading] = useState(false);
    const [showOptionModal, setShowOptionModal] = useState(false);
    const [confirmLoginLoading, setConfirmLoginLoading] = useState(false);
    const [sendCodeLoading, setSendCodeLoading] = useState(false);
    const [codeLoginLoading, setCodeLoginLoading] = useState(false);
    const [currentSubmodal, setCurrentSubmodal] = useState(null);
    const [modalXImg, setModalXImg] = useState("");
    const [mainLoginError, setMainLoginError] = useState(null);
    const [loginWithCodeError, setLoginWithCodeError] = useState(null);
    const [postLoginError, setPostLoginError] = useState(null);

    // "local", "cloud", or "both"
    const [selectedDataOption, setSelectedDataOption] = useState("both");
    const [user] = useState({
        email: null, username: null, data: {}
    });

    // When a user logs in with Google or email+code, this function is called
    // with result being the returned json {email, username, data, isNewUser}
    const onLoginSuccess = async (result) => {
        // result: { email: "", data: {}, username: "username", isNewUser: true/false}
        user.email = result.email;
        user.username = result.username;
        user.data = result.data;
        // If a new user, default to keeping device data
        if(result.isNewUser === true) {
            setSelectedDataOption("local");
            // Show loading image
            setLoading(true);
            await onLoginFinish("local");
        }
        else {
            const localData = await DataHandler.getAllData();
            // If there are no local courses (and no rounds)
            if(localData.courses.length === 0) {
                setSelectedDataOption("cloud");
                setLoading(true);
                // Show loading image
                await onLoginFinish("cloud");
            }
        }
        // Otherwise, it's not a new user and they have data, so
        // let them decide what to do with their data
        setShowOptionModal(true);
    }

    // Once the user chooses what to do with their data and presses "confirm",
    // this function is called
    const onChooseOption = async (event) => {
        setConfirmLoginLoading(true);
        event.preventDefault();
        event.stopPropagation();

        await onLoginFinish(selectedDataOption);
        setConfirmLoginLoading(false);
    }

    // This is called at the end. We will deal with the data the way the user
    // wants and then finish logging in
    const onLoginFinish = async (dataOption) => {
        console.log(dataOption);
        setPostLoginError(null);
        let result;
        // If keeping device data...
        if(dataOption === "local") {
            // Replace all data in cloud with devide data
            await DataHandler.replaceUpdateQueueWithCurrentData();
            result = await httpUploadQueueToCloud(true);
        }
        // If keeping cloud data...
        else if(dataOption === "cloud") {
            // Delete all local data
            await DataHandler.clearAllCoursesAndRounds();
            await DataHandler.clearUpdateQueue();
            // Retrieve all data from cloud
            result = await httpRetrieveAllDataFromCloud();
        }
        // If keeping data from both...
        else {
            // Replace update queue with current data
            await DataHandler.replaceUpdateQueueWithCurrentData();
            // Pull data from server
            result = await httpRetrieveAllDataFromCloud();
            // Now push the local data to server
            if(result.success) {
                const cloudData = result.data;
                result = await httpUploadQueueToCloud(false);
                if(result.success) {
                    await DataHandler.bulkAdd(cloudData.courses, cloudData.rounds);
                }
            }
        }
        if(result.success) {
            localStorage.setItem("email", user.email);
            localStorage.setItem("username", user.username);
            localStorage.setItem("last-pushed-to-cloud", Date ());
            setMainLoginError(null);
            setPostLoginError(null);
            setShowOptionModal(false);
            setSelectedDataOption(null);
            props.onLogin(user.email, user.username);
        }
        else {
            console.log(result);
        }
        setLoading(false);
    }

    const sendCode = async (event) => {
        event.preventDefault();
        event.stopPropagation();
        setMainLoginError(null);

        setSendCodeLoading(true);
        user.email = event?.target?.email?.value;
        // const result = { success: true};
        const result = await httpRequestEmailCode(user.email);
        // When code has been sent, show code modal
        if(result.success === true) {
            setModalXImg("back-arrow");
            setCurrentSubmodal(Modals.LOGIN_CODE_MODAL);
        }
        else {
            setMainLoginError(result.error);
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
        const result = await httpConfirmEmailCode(user.email, event?.target?.code?.value);
        if(result.success) {
            onLoginSuccess(result.data);
        }
        else {
            setLoginWithCodeError(result.error);
            console.log(result);
        }
        setCodeLoginLoading(false);
    }

    const onGoogleLoginAttempt = (result) => {
        if(result.success) {
            onLoginSuccess(result.data);
            setMainLoginError(null);
        }
        else {
            setMainLoginError(result.error);
        }
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

                <div className={loading ? "opacity-0 pointer-events-none" : ""}>
                    {/* IF NOT LOGGED IN YET */}
                    {!showOptionModal &&
                    <>
                        {/* IF ON MAIN LOGIN MODAL */}
                        {!currentSubmodal &&
                        <>
                            <form className="w-[90%] text-left mx-auto" onSubmit={sendCode}>
                                <div className="text-desc text-[12px] text-gray-mild">We will send a code to your email and ask for you to verify it at the next step. The code will expire after 10 minutes.</div>
                                <label htmlFor="login-email-input" className="text-left text-[13px] text-gray-dark">Email:</label>
                                <input id="login-email-input" name="email" type="email" className="mb-[10px] w-[100%]" placeholder="example@email.com">
                                </input>
                                {mainLoginError &&
                                <div className="text-desc text-red-caution text-[13px] text-center mb-[10px]">{mainLoginError}</div>
                                }
                                <div className="text-center">
                                    <ModalButton loading={sendCodeLoading} type="submit" className="bg-blue-basic text-white block">Send Code</ModalButton>
                                </div>
                            </form>
                                
                            <hr className="text-gray-mild mt-[15px] mb-[10px]"></hr>
                            <div className="text-desc text-gray-dark text-[12px] mb-[15px]">Or log in another way</div>
                            <GoogleLoginButton onSubmit={onGoogleLoginAttempt} className="inline-block w-[40px]">
                                <img className="w-[40px]" src={googleIcon}></img>
                            </GoogleLoginButton>
                        </>}
                        
                        {/* IF ON CODE INPUT MODAL */}
                        {currentSubmodal === Modals.LOGIN_CODE_MODAL &&
                        <>
                            <form className="text-left max-[90%] mx-auto" onSubmit={onCodeSubmit}>
                                <div className="text-desc text-gray-mild text-[13px] mb-[10px] w-[90%] mx-auto">
                                    A code was sent to
                                    <div className="italic text-gray-dark ml-[10px]">{user.email}.</div>
                                </div>
                                <hr className="w-[90%] mx-auto text-gray-mild mb-[10px]"></hr>
                                <div className="w-[200px] mx-auto max-w-[90%]">
                                    <label htmlFor="login-code-input" className="text-desc text-[13px] text-gray-dark block">Enter code:</label>
                                    <input id="login-code-input" name="code" inputMode="numeric" className="block w-[100%] text-center" placeholder="000000" maxLength={6} autoComplete="off"></input>
                                </div>
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
                    {showOptionModal && <form onSubmit={onChooseOption} className="text-left mb-[0px]">
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
                        {postLoginError &&
                        <div className="text-desc text-red-caution text-[13px] mb-[10px] w-[90%] mx-auto">
                            {postLoginError}
                        </div>}
                        <div className="text-center">
                            <ModalButton loading={confirmLoginLoading} className="bg-blue-basic text-white">Confirm</ModalButton>
                        </div>
                    </form>}
                </div>
                {loading &&
                <div className="absolute top-[50%] left-[50%] translate-[-50%]">
                    <LoadingImg className="w-[40px]"></LoadingImg>
                </div>
                }
        </MenuModal>
    );
}

export default MainLoginModal;