import React from "react";
import DataHandler from "../data_handling/data_handler";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import { download } from "../js_utils/downloads";
import { Modals } from "../js_utils/Enums";
import MainLoginModal from "./Modals/MainLoginModal";
import { uploadQueueToCloud } from "../serverCalls/data.mjs";
import { createLastPushedToCloudString } from "../js_utils/dates.js";
import MenuModal from "./Modals/Frames/MenuModal.jsx";
import ModalTitle from "./Modals/ModalComponents/ModalTitle.jsx";

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
            confirmDelete: localStorage.getItem("confirm-delete") === "true",
            lastPushedToCloudString: createLastPushedToCloudString(localStorage.getItem("last-pushed-to-cloud")),
            email: localStorage.getItem("email") || null,
            currentModal: null,
            // Keep track of which requests to the server are loading so we can
            // show a loading circle over those buttons
            logoutLoading: false,
            uploadChangesToCloudLoading: false,
            uploadChangesToCloudError: null
        };
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

    onLogin = (email) => {
        this.setState({
            email: email,
            currentModal: null,
            lastPushedToCloudString: createLastPushedToCloudString(localStorage.getItem("last-pushed-to-cloud")),
            uploadChangesToCloudError: null
        });
    }

    onLogout = () => {
        this.setState({ logoutLoading: true });
        localStorage.removeItem("email");
        localStorage.removeItem("last-pushed-to-cloud");
        this.setState({
            email: null,
            logoutLoading: false,
            currentModal: null
        });
    }
    
    handleUploadChangesToCloud = async () => {
        this.setState({ uploadChangesToCloudLoading: true });
        const email = localStorage.getItem("email");
        const result = await uploadQueueToCloud(email, false);
        if(result.success) {
            const date = Date ();
            localStorage.setItem("last-pushed-to-cloud", date);
            this.setState({
                lastPushedToCloudString: createLastPushedToCloudString(date),
                uploadChangesToCloudError: null
            });
        }
        else {
            let error;
            if(result.status === 401) {
                // Log them out so they don't try to request again
                error = "Failed to upload data: You are not logged in.";
                localStorage.removeItem("email");
                localStorage.removeItem("last-pushed-to-cloud");
                this.setState({ 
                    email: null,
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

    render = () => {
        return (
            <div>
                <div className="settings-page mt-[70px]">

                    {/* If the user is not logged in */}
                    {!this.state.email &&
                        <SettingsBlock>
                            <ModalButton className="bg-gray-dark text-white float-right" onClick={() => this.setState({ currentModal: Modals.MAIN_LOGIN })}>Log in</ModalButton>
                            <div className="text-desc text-gray">Log in to save your data to the cloud.</div>
                        </SettingsBlock>
                    }

                    {/* If the user is logged in */}
                    {this.state.email &&
                        <>
                            <SettingsBlock>
                                <ModalButton onClick={() => {this.setState({ currentModal: Modals.CONFIRM_LOGOUT })}} className="bg-red-caution text-white float-right">Log out</ModalButton>
                                <div className="text-desc text-gray">You are logged in as</div>
                                <div className="text-desc text-gray italic">{this.state.email}</div>
                            </SettingsBlock>
                            <SettingsBlock>
                                <div className="w-100% text-center">
                                    <div className="text-desc text-gray text-left">
                                        {this.state.lastPushedToCloudString}
                                    </div>
                                    <ModalButton className="bg-gray-dark text-white w-[90%] mt-[10px]" loading={this.state.uploadChangesToCloudLoading} onClick={this.handleUploadChangesToCloud}>Upload changes to cloud</ModalButton>
                                    {this.state.uploadChangesToCloudError && 
                                        <div className="text-desc text-red-caution mt-[3px]">{this.state.uploadChangesToCloudError}</div>
                                    }
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
                    <p className="text-desc my-[10px] text-center">Version: {localStorage.getItem("version")}</p>
                    <SettingsBlock>
                        <ModalButton className="bg-gray-dark text-white float-right" onClick={this.downloadData}>Download data</ModalButton>
                        <div className="text-desc text-gray">
                            Download all your courses and rounds into a JSON file.
                        </div>
                    </SettingsBlock>
                    <SettingsBlock className="min-h-[60px] bg-special">
                        <input type="checkbox" className="float-right w-[40px] h-[40px] accent-gray-dark" onChange={this.handleConfirmDeleteToggle}
                            id="confirm-delete-checkbox" checked={this.state.confirmDelete}>    
                        </input>
                        <div className="text-desc">
                            Ask for confirmation before deleting courses or rounds.
                        </div>
                    </SettingsBlock>
                </div>

            </div>
        );
    }
}

export default SettingsPage;