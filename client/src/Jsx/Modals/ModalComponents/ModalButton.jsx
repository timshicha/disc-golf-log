import React from "react";
import "../../../css/general.css";

class ModalButton extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className={"inline-block text-[18px] px-[10px] py-[5px] font-bold font-sans rounded-[7px] cursor-pointer " + this.props.className}>
                {this.props.children}
            </button>
        );
    }
}

export default ModalButton;