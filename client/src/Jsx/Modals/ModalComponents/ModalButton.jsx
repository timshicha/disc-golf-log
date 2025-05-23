import React from "react";
import "../../../css/general.css";

class ModalButton extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className={"inline-block p-[10px] text-[18px] font-bold font-sans rounded-[7px] cursor-pointer " + this.props.className}>
                {this.props.children}
            </button>
        );
    }
}

export default ModalButton;