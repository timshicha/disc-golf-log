import React, { createRef } from "react";
import "../../css/OptionsList.css";
import "../../css/forms.css";
import MainModal from "./MainModal";
import ModalButton from "./ModalComponents/ModalButton";

class RenameModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.nameInputRef = createRef();
        this.state = {
            inputValue: props.value || ""
        }
    }

    onChange = (event) => {
        this.setState({
            inputValue: event.target.value
        });
    }

    componentDidMount = () => {
        this.nameInputRef.current?.focus();
    }

    render = () => {
        return (
            <>
            <MainModal {...this.props}>
                {this.props.children}
                <label htmlFor="name"></label>
                <input type="text" id="name" name="name" ref={this.nameInputRef} className="rename-input" value={this.state.inputValue} onChange={this.onChange}></input>
                <ModalButton className="half-width-button mx-5" type="submit">Apply</ModalButton>
                <ModalButton className="half-width-button mx-5" type="button" onClick={() => {this.setState({inputValue: ""})}}>Clear</ModalButton>
            </MainModal>

            </>
        );
    }
}

export default RenameModal;