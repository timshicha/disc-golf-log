import React from "react";
import DataHandler from "../DataHandling/DataHandler.js";
import ModalButton from "../Jsx/Modals/ModalComponents/ModalButton.jsx";
import { download } from "../Utilities/downloads.js";
import { Modals } from "../Utilities/Enums.js";
import MainLoginModal from "../Jsx/Modals/MainLoginModal.jsx";
import { httpUploadQueueToCloud } from "../serverCalls/data.mjs";
import { createLastPushedToCloudString } from "../Utilities/dates.js";
import MenuModal from "../Jsx/Modals/Frames/MenuModal.jsx";
import ModalTitle from "../Jsx/Modals/ModalComponents/ModalTitle.jsx";
import editIcon from "../assets/images/editIcon.png";
import Input from "../Jsx/Modals/ModalComponents/Input.jsx";
import { httpChangeUsername } from "../ServerCalls/usernames.mjs";
import { isValidUsername } from "../Utilities/format.js";
import { httpUpdateProfileVisibility } from "../ServerCalls/profile.mjs";

const SettingsBlock = (props) => {
    return (
        <div className={"w-[90%] bg-gray-light mx-auto rounded-[7px] p-[10px] mb-[10px] min-h-[62px] "
            + props.className}>
            {props.children}
        </div>
    );
}

class SettingsPage extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;
        // Pull user settings from local storage
        this.state = {
            confirmDelete: localStorage.getItem("confirm-delete") == "true",
            autoOpenCourseOnCreation: localStorage.getItem("auto-open-course-on-creation") == "true",
            autoScrollToBottomOnCourseOpen: localStorage.getItem("auto-scroll-to-bottom-on-course-open") == "true",
            lastPushedToCloudString: ". . .",
            email: localStorage.getItem("email") || null,
            username: localStorage.getItem("username") || null,
            usernameModified: localStorage.getItem("username-modified") === "true",
            public_profile: localStorage.getItem("public-profile"),
            currentModal: null,
            // Keep track of which requests to the server are loading so we can
            // show a loading circle over those buttons
            logoutLoading: false,
            uploadChangesToCloudLoading: false,
            uploadChangesToCloudError: null,
            changingUsername: false,
            newUsername: "",
            changeUsernameError: null,
            changeUsernameLoading: false
        };
        this.updateLastPushedToCloudString();
    }

    updateLastPushedToCloudString = () => {
        createLastPushedToCloudString(localStorage.getItem("last-pushed-to-cloud")).then(result => {
            this.setState({ lastPushedToCloudString: result });
        });
    }

    navigateTo = (newPage) => {
        if(this.props.navigateTo) {
            this.props.navigateTo(newPage);
        }
        else {
            alert("This feature is under construction!");
        }
    }

    downloadData = () => {
        return DataHandler.getAllData().then(result => {
            download(result, "bogey_pad_data.json", true);
        });
    }

    handleConfirmDeleteToggle = (event) => {
        this.setState({ confirmDelete: event.target.checked });
        localStorage.setItem("confirm-delete", event.target.checked);
    }

    handleAutoOpenCourseOnCreation = (event) => {
        this.setState({ autoOpenCourseOnCreation: event.target.checked });
        localStorage.setItem("auto-open-course-on-creation", event.target.checked);
    }

    handleAutoScrollToBottomOnCourseOpen = (event) => {
        this.setState({ autoScrollToBottomOnCourseOpen: event.target.checked });
        localStorage.setItem("auto-scroll-to-bottom-on-course-open", event.target.checked);
    }

    onLogin = (email, username, usernameModified) => {
        this.setState({
            email: email,
            username: username,
            currentModal: null,
            uploadChangesToCloudError: null,
            usernameModifed: usernameModified
        });
        this.updateLastPushedToCloudString();
    }

    onLogout = () => {
        this.setState({ logoutLoading: true });
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("last-pushed-to-cloud");
        this.setState({
            email: null,
            username: null,
            logoutLoading: false,
            currentModal: null
        });
    }
    
    handleUploadChangesToCloud = async () => {
        this.setState({ uploadChangesToCloudLoading: true });
        const email = localStorage.getItem("email");
        const result = await httpUploadQueueToCloud(false);
        if(result.success) {
            const date = Date ();
            localStorage.setItem("last-pushed-to-cloud", date);
            this.setState({
                uploadChangesToCloudError: null
            });
            this.updateLastPushedToCloudString();
        }
        else {
            let error;
            if(result.status === 401) {
                // Log them out so they don't try to request again
                error = "Failed to upload data: You are not logged in.";
                localStorage.removeItem("email");
                localStorage.removeItem("username");
                localStorage.removeItem("last-pushed-to-cloud");
                this.setState({ 
                    email: null,
                    username: null,
                    lastPushedToCloudString: ""
                });
            }
            else if(result.status === 500) {
                error = "Failed to upload data: A problem occured in the server.";
            }
            else if(result.status === 404) {
                error = "Failed to upload data: Bad request (not your fault).";
            }
            else if(!result.status) {
                error = "Failed to upload data: Could not connect to server.";
            }
            else {
                error = "Failed to upload data.";
            }
            this.setState({ uploadChangesToCloudError: error });
        }
        this.setState({ uploadChangesToCloudLoading: false });
    }

    onChangeUsernameClick = () => {
        this.setState({ changingUsername: true });
    }

    onChangeUsernameCancel = () => {
        this.setState({ changingUsername: false });
    }

    onNewUsernameChange = (event) => {
        this.setState({ newUsername: event.target.value });
    }

    onUpdateProfileVisibilityClick = async () => {
        const newPublicProfile = !this.state.public_profile;
        const result = await httpUpdateProfileVisibility(newPublicProfile);
        if(result.success) {
            this.setState({ public_profile: newPublicProfile });
            localStorage.setItem("public-profile", newPublicProfile);
        }
        else {
            console.log(result.error);
        }
    }

    onChangeUsernameSubmit = async () => {
        this.setState({ changeUsernameLoading: true });
        // Logic for changing username
        // See if valid username (locally first)
        let result;
        const validUsername = isValidUsername(this.state.newUsername);
        if(validUsername.isValid) {
            result = await httpChangeUsername(this.state.newUsername);
        }
        else {
            result = { success: false, error: validUsername.error };
        }
        if(result.success) {
            localStorage.setItem("username", this.state.newUsername);
            localStorage.setItem("username-modified", true);
            this.setState({
                changeUsernameLoading: false,
                changingUsername: false,
                username: this.state.newUsername,
                usernameModified: true
            });
        }
        else {
            this.setState({
                changeUsernameLoading: false,
                changeUsernameError: result.error
            });
        }
    }

    render = () => {
        return (
            <div>
                <div className="settings-page mt-[70px] mb-[40px]">

                    {/* If the user is not logged in */}
                    {!this.state.email &&
                        <SettingsBlock>
                            <ModalButton className="bg-gray-dark text-white float-right" onClick={() => this.setState({ currentModal: Modals.MAIN_LOGIN })}>Log in</ModalButton>
                            <div className="text-desc text-gray-mild">Log in to save your data to the cloud.</div>
                        </SettingsBlock>
                    }

                    {/* If the user is logged in */}
                    {this.state.email &&
                        <>
                            <SettingsBlock>
                                {!this.state.changingUsername &&
                                <>
                                    <ModalButton className="float-right bg-gray-dark py-[9px]" disabled={this.state.usernameModified} onClick={this.onChangeUsernameClick}>
                                        <img src={editIcon} className="w-[25px]"/>
                                    </ModalButton>
                                    <div className="text-desc text-gray text-[11px] mb-[-3px]">Username</div>
                                    <div className="text-desc text-gray-dark italic max-w-[calc(100%-48px)] break-words">{this.state.username}</div>
                                    <div className="text-desc text-gray text-[11px] mt-[5px] mb-[-3px]">Email</div>
                                    <div className="text-desc text-gray-dark italic">{this.state.email}</div>
                                    <div className="w-[100%] text-center mt-[10px]">
                                    <ModalButton onClick={() => {this.setState({ currentModal: Modals.CONFIRM_LOGOUT })}} className="bg-red-caution text-white">Log out</ModalButton>
                                </div>
                                </>}
                                {this.state.changingUsername &&
                                <>
                                    <div className="text-desc text-red-caution text-[14px] mb-[5px]">You may change your username once. If you need to change it again, you will need to contact support.</div>
                                    <div className="text-desc text-gray-mild text-[14px]"> New username:</div>
                                    <div className="mb-[10px]">
                                        <Input id="change-username-input" className="w-[100%]" value={this.state.newUsername} onChange={this.onNewUsernameChange}></Input>
                                        {this.state.changeUsernameError &&
                                        <div className="text-desc text-[14px] text-red-caution text-center mt-[5px]">{this.state.changeUsernameError}</div>}
                                        <div className="text-center">
                                            <ModalButton className="bg-gray-dark text-white my-[10px] mx-[3px] px-[10px]" disabled={this.state.changeUsernameLoading} onClick={this.onChangeUsernameCancel}>Cancel</ModalButton>
                                            <ModalButton className="bg-blue-basic text-white my-[10px] mx-[3px] px-[10px]" loading={this.state.changeUsernameLoading} onClick={this.onChangeUsernameSubmit}>Change Username</ModalButton>
                                        </div>
                                    </div>
                                </>}
                            </SettingsBlock>
                            <SettingsBlock>
                                <div className="w-100% text-center">
                                    <div className="text-desc text-gray-mild text-left">
                                        {this.state.lastPushedToCloudString}
                                    </div>
                                    <ModalButton className="bg-gray-dark text-white w-[90%] mt-[10px]" loading={this.state.uploadChangesToCloudLoading} onClick={this.handleUploadChangesToCloud}>Upload changes to cloud</ModalButton>
                                    {this.state.uploadChangesToCloudError && 
                                        <div className="text-desc text-red-caution mt-[3px]">{this.state.uploadChangesToCloudError}</div>
                                    }
                                </div>
                            </SettingsBlock>
                            <SettingsBlock>
                                <div className="text-desc text-gray-mild text-left">
                                    Your profile is currently {this.state.public_profile ? "public" : "private"}.
                                </div>
                                <div className="text-center mt-[10px]">
                                    <ModalButton onClick={this.onUpdateProfileVisibilityClick} className="bg-gray-dark text-white">Set to {this.state.public_profile ? "private" : "public"}</ModalButton>
                                </div>
                            </SettingsBlock>
                        </>
                    }

                    {this.state.currentModal === Modals.MAIN_LOGIN &&
                        <MainLoginModal onLogin={this.onLogin} onClose={() => {this.setState({ currentModal: null })}}>
                        </MainLoginModal>
                    }
                    {this.state.currentModal === Modals.CONFIRM_LOGOUT &&
                        <MenuModal onClose={() => {this.setState({ currentModal: null })}}>
                            <ModalTitle>Confirm Logout?</ModalTitle>
                            <div className="text-desc text-gray-dark text-left text-[14px]">Are you sure you want to log out? Any changes that have not been uploaded to cloud will not be uploaded.</div>
                            <div className="mt-[5px]">
                                <ModalButton className="w-[45%] bg-gray-dark text-white m-[5px]" onClick={() => this.setState({ currentModal: null })}>Cancel</ModalButton>
                                <ModalButton className="w-[45%] bg-red-caution text-white m-[5px]" onClick={this.onLogout}>Log out</ModalButton>
                            </div>
                        </MenuModal>
                    }

                    <div className="w-[100%] h-[2px] bg-gray-light"></div>
                    <p className="text-desc text-gray-mild my-[10px] text-center">Version: {localStorage.getItem("version")}</p>
                    <SettingsBlock className="min-h-[60px] bg-special">
                        <input type="checkbox" className="float-right w-[40px] h-[40px] accent-gray-dark m-[3px]" onChange={this.handleConfirmDeleteToggle}
                            id="confirm-delete-checkbox" checked={this.state.confirmDelete}>    
                        </input>
                        <div className="text-desc text-gray-mild">
                            Ask for confirmation before deleting courses or rounds.
                        </div>
                    </SettingsBlock>
                    <SettingsBlock className="min-h-[60px] bg-special">
                        <input type="checkbox" className="float-right w-[40px] h-[40px] accent-gray-dark m-[3px]" onChange={this.handleAutoOpenCourseOnCreation}
                            id="auto-open-course-on-creation-checkbox" checked={this.state.autoOpenCourseOnCreation}>    
                        </input>
                        <div className="text-desc text-gray-mild">
                            Automatically open course after it is created.
                        </div>
                    </SettingsBlock>
                    <SettingsBlock className="min-h-[60px] bg-special">
                        <input type="checkbox" className="float-right w-[40px] h-[40px] accent-gray-dark m-[3px]" onChange={this.handleAutoScrollToBottomOnCourseOpen}
                            id="auto-scroll-to-bottom-on-course-open-checkbox" checked={this.state.autoScrollToBottomOnCourseOpen}>    
                        </input>
                        <div className="text-desc text-gray-mild">
                            Automatically scroll to the most recent rounds when opening a course.
                        </div>
                    </SettingsBlock>
                    <SettingsBlock>
                        <ModalButton className="bg-gray-dark text-white float-right m-[3px]" onClick={this.downloadData}>Download data</ModalButton>
                        <div className="text-desc text-gray-mild">
                            Download all your courses and rounds into a JSON file.
                        </div>
                    </SettingsBlock>
                    <div className="w-[100%] h-[2px] bg-gray-light mb-[10px]"></div>
                    <SettingsBlock>
                        <div className="text-desc text-gray-mild text-center mb-[10px]">Support</div>
                        
                        <div className="text-desc text-gray-mild">
                            Email: <a href="mailto:support@bogeypad.com" className="text-desc text-gray-mild underline">support@bogeypad.com</a>
                        </div>
                    </SettingsBlock>
                </div>

            </div>
        );
    }
}

export default SettingsPage;