import React, { createRef } from "react";
import "../../css/OptionsList.css";
import whiteX from "../../assets/images/whiteX.png";
import Backdrop from "../BackDrop";

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
                <div {...this.props} className="form-main options-modal" ref={this.ref}>
                    {/* X-button closes the options list window */}
                    <input type="image" src={whiteX}
                        onClick={this.props.onClose}
                        className="options-list-x">
                    </input>
                    {this.props.children}  
                </div>
            </>
        );
    }
}

export default OptionsList;