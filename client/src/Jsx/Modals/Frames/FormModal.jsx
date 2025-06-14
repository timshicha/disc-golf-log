import React, { createRef } from "react";
import { createPortal } from "react-dom";
import Backdrop from "../ModalComponents/BackDrop";
import CloseX from "../ModalComponents/CloseX";

class FormModal extends React.Component {
    constructor (props) {
        super();

        this.props = props;
        this.ref = createRef();
    }

    // Handle Click on the outside (close form)
    handleClickOutside = (event) => {
        if(this.ref.current && !this.ref.current.contains(event.target)) {
            event.preventDefault();
            event.stopPropagation();
            this.props.onClose();
        }
    }

    render = () => {
        return createPortal(
            <>
                <Backdrop onClick={this.handleClickOutside}></Backdrop>
                <form onSubmit={this.props.onSubmit} className="fixed top-[50%] left-[50%] z-1000
                    bg-gray-subtle rounded-[10px] p-[10px] text-center
                    translate-x-[-50%] translate-y-[-50%] w-[350px] max-w-[95%] h-[fit-content]
                    text-[20px] font-sans font-bold
                    [&_input,textarea]:inline-block [&_input,textarea]:p-[5px] [&_input,textarea]:bg-gray-lighter" 
                ref={this.ref}>
                    {/* X-button closes the options list window */}
                    {/* replaceImg="back-arrow": back arrow instead of X */}
                    <CloseX replaceImg={this.props.replaceImg} onClick={this.props.onBack || this.props.onClose}></CloseX>
                    {this.props.children}  
                </form>
            </>,
            document.body
        );
    }
}

export default FormModal;