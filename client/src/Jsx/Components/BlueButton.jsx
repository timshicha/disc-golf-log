import React from "react";
import "../../css/general.css";

class BlueButton extends React.Component {
    constructor (props) {
        super();

        this.props = props;
        this.state = {
            className: props.className
        }
    }

    render = () => {
        return (
            <button {...this.props} className={"blue-button " + this.state.className}>
                {this.props.children}
            </button>
        );
    }
}

export default BlueButton;