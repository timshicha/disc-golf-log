import React, { createRef } from "react";
import Backdrop from "../ModalComponents/BackDrop";
import CloseX from "../ModalComponents/CloseX";
import { createPortal } from "react-dom";

class MenuModal extends React.Component {
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
        return createPortal(
            <>
                <Backdrop onClick={this.handleClickOutside}></Backdrop>
                <div onSubmit={this.props.onSubmit} className={"fixed top-[50%] left-[50%] z-1000\
                    bg-gray-subtle rounded-[10px] p-[10px] text-center\
                    translate-x-[-50%] translate-y-[-50%] w-[300px] max-w-[95%] h-[fit-content]\
                    text-[20px] font-sans font-bold " + this.props.className} ref={this.ref}>
                    {/* X-button closes the options list window */}
                    <CloseX replaceImg={this.props.replaceImg} onClick={this.props.onBack || this.props.onClose}></CloseX>
                    {this.props.children}  
                </div>
            </>,
            document.body
        );
    }
}

export default MenuModal;