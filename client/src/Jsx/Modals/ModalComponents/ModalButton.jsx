import React from "react";
import "../../../css/general.css";

class ModalButton extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className={"form-button black-text " + this.props.className}>
                {this.props.children}
            </button>
        );
    }
}

export default ModalButton;