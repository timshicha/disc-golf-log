import React from "react";
import "../css/settingsPage.css";
import DataHandler from "../data_handling/data_handler";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import db from "../data_handling/db";
import { download } from "../js_utils/downloads";

class SettingsPage extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;
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

    render = () => {
        return (
            <div className="settings-page">
                <p className="settings-text version-text">Version: {localStorage.getItem("version")}</p>
                <div className="settings-block">
                    <ModalButton className="gray-background download-button white-text" onClick={this.downloadData}>Download data</ModalButton>
                    <div className="settings-text">
                        Download all your courses and rounds into a JSON file.
                    </div>
                </div>
                <div className="settings-block">
                    <input type="checkbox" className="settings-checkbox"></input>
                    <div className="settings-text">
                        Ask for confirmation before deleting courses or rounds.
                    </div>
                </div>
            </div>
        );
    }
}

export default SettingsPage;