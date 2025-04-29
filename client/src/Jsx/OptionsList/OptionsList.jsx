import React, { createRef } from "react";
import "../../css/OptionsList.css";
import whiteX from "../../assets/images/whiteX.png";
import Backdrop from "../BackDrop";
import CloseX from "../CourseComponents/CloseX";

class OptionsList extends React.Component {
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

export default OptionsList;