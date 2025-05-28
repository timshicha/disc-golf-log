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
                <div {...this.props} className="form-main options-modal" ref={this.ref}>
                    {/* X-button closes the options list window */}
                    <CloseX onClick={this.props.onClose}></CloseX>
                    {this.props.children}  
                </div>
            </>,
            document.body
        );
    }
}

export default MenuModal;