import React from "react";
import DataHandler from "../data_handling/data_handler";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import { download } from "../js_utils/downloads";
import { Modals } from "../js_utils/Enums";
import MainLoginModal from "./Modals/MainLoginModal";
import { retrieveAllDataFromCloud, uploadChangesToCloud } from "../serverCalls/data.mjs";

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
            lastPushedToCloud: localStorage.getItem("last-pushed-to-cloud") || null,
            email: localStorage.getItem("email") || null,
            currentModal: null
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
            currentModal: null
        });
        localStorage.setItem("email", email);
        retrieveAllDataFromCloud().then(result => result.json()).then(result => {
            DataHandler.bulkAdd(result.courses, result.rounds);
        });
        // Ask what they want to do:
        // 1) Overwrite their cloud data with current data (CONFIRM)
        // 2) Delete their current data and load their cloud data (CONFIRM)
        // 3) Merge their data (try to keep both)

    }

    onLogout = () => {
        // Upload their data first
        DataHandler.getQueue().then(data => {
            uploadChangesToCloud(this.state.email, data).then(() => {
                DataHandler.clearData();
                DataHandler.clearUpdateQueue();
                this.setState({ email: null });
                localStorage.removeItem("email");
            }).catch(error => {
                this.console.log(error);
            });
        });
    }

    handleUploadChangesToCloud = () => {
        DataHandler.getQueue().then(data => {
            console.log(data);
            uploadChangesToCloud(this.state.email, data).then(result => result.json()).then(result => {
                const now = Date();
                localStorage.setItem("last-pushed-to-cloud", now);
                this.setState({
                    lastPushedToCloud: now
                });
                
                return DataHandler.clearUpdateQueue();
            }).catch(error => {
                console.log(error);
            });
        })
    }

    render = () => {
        return (
            <div className="settings-page">
                {/* Spacer for navbar */}
                <div className="h-[70px]"></div>

                {/* If the user is not logged in */}
                {!this.state.email &&
                    <SettingsBlock>
                        <ModalButton className="bg-gray-dark text-white float-right" onClick={() => this.setState({ currentModal: Modals.MAIN_LOGIN })}>Log in</ModalButton>
                        <div className="text-desc text-gray">You are not logged in. Log in to save your data to the cloud.</div>
                    </SettingsBlock>
                }

                {/* If the user is logged in */}
                {this.state.email &&
                    <>
                        <SettingsBlock>
                            <ModalButton onClick={this.onLogout} className="bg-red-caution text-white float-right">Log out</ModalButton>
                            <div className="text-desc text-gray">You are logged in as</div>
                            <div className="text-desc text-gray italic">{this.state.email}</div>
                        </SettingsBlock>
                        <SettingsBlock>
                            <div className="w-100% text-center">
                                <div className="text-desc text-gray text-left">
                                    {this.state.lastPushedToCloud && <>Changes last uploaded to cloud {this.state.lastPushedToCloud}.</>}
                                    {!this.state.lastPushedToCloud && <>Changes have not yet been uploaded to cloud.</>}
                                </div>
                                <ModalButton className="bg-gray-dark text-white w-[90%] mt-[10px]" onClick={this.handleUploadChangesToCloud}>Upload changes to cloud</ModalButton>
                                <ModalButton className="bg-gray-dark text-white w-[90%] mt-[10px]">Download changes from cloud</ModalButton>
                            </div>
                        </SettingsBlock>
                    </>
                }

                {this.state.currentModal === Modals.MAIN_LOGIN &&
                    <MainLoginModal onLogin={this.onLogin} onClose={() => {this.setState({ currentModal: null })}}>
                    </MainLoginModal>
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
                <button onClick={DataHandler.replaceUpdateQueueWithCurrentData}>test</button>
            </div>
        );
    }
}

export default SettingsPage;