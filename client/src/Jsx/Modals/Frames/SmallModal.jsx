import React, { createRef } from "react";
import Backdrop from "../ModalComponents/BackDrop";
import CloseX from "../ModalComponents/CloseX";
import { createPortal } from "react-dom";

class SmallModal extends React.Component {
    constructor (props) {
        super();

        this.props = props;
        this.ref = createRef();
    }

    handleClickOutside = (event) => {
        if(this.ref.current && !this.ref.current.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onClose();
        }
    }

    render = () => {
        return (
            <>
                <div className={"z-1000 absolute " + this.props.className} ref={this.ref}>
                    {/* X-button closes the options list window */}
                    <CloseX className="absolute" replaceImg={this.props.replaceImg} onClick={this.props.onBack || this.props.onClose}></CloseX>
                    {this.props.children}
                </div>
                <Backdrop onClick={this.handleClickOutside}></Backdrop>
            </>
        )
    }
}

export default SmallModal;