import React from "react";
import DataHandler from "../data_handling/data_handler";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import { download } from "../js_utils/downloads";

const SettingsBlock = (props) => {
    return (
        <div className={"settings-block w-[90%] bg-[#dddddd] mx-auto rounded-[7px] p-[10px] mb-[10px] "
            + props.className}>
            {props.children}
        </div>
    );
}

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
                <p className="text-desc mt-[70px] mb-[10px] text-center">Version: {localStorage.getItem("version")}</p>
                <SettingsBlock>
                    <ModalButton className="gray-background download-button text-white float-right" onClick={this.downloadData}>Download data</ModalButton>
                    <div className="text-desc text-gray">
                        Download all your courses and rounds into a JSON file.
                    </div>
                </SettingsBlock>
                <SettingsBlock className="min-h-[60px] bg-special">
                    <input type="checkbox" className="settings-checkbox float-right w-[40px] h-[40px] accent-[#444444]"></input>
                    <div className="text-desc">
                        Ask for confirmation before deleting courses or rounds.
                    </div>
                </SettingsBlock>
            </div>
        );
    }
}

export default SettingsPage;