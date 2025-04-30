import React, { createRef } from "react";
import "../../css/OptionsList.css";
import Backdrop from "./ModalComponents/BackDrop";
import CloseX from "./ModalComponents/CloseX";

class MainModal extends React.Component {
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
        return (
            <>
                <Backdrop onClick={this.handleClickOutside}></Backdrop>
                <form {...this.props} className="form-main options-modal" ref={this.ref}>
                    {/* X-button closes the options list window */}
                    <CloseX onClick={this.props.onClose}></CloseX>
                    {this.props.children}  
                </form>
            </>
        );
    }
}

export default MainModal;