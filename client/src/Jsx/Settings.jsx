import React from "react";

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

    render = () => {
        return (
            <>
            settings
            <button onClick={() => {this.navigateTo("main")}}>Back to home</button>
            </>
        );
    }
}

export default SettingsPage;