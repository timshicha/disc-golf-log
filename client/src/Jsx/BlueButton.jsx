import React from "react";
import "../css/general.css";

class BlueButton extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <div {...this.props} className="blue-button">
                {this.props.children}
            </div>
        );
    }
}

export default BlueButton;