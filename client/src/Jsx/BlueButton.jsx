import React from "react";
import "../css/general.css";

class BlueButton extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className="blue-button">
                {this.props.children}
            </button>
        );
    }
}

export default BlueButton;