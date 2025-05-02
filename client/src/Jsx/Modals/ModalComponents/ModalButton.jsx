import React from "react";

class ModalButton extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className={"form-button " + this.props.className}>
                {this.props.children}
            </button>
        );
    }
}

export default ModalButton;