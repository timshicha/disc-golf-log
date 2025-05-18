import React, { createRef } from "react";
import "../../css/optionsList.css";
import "../../css/forms.css";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";

class RenameModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.nameInputRef = createRef();
        this.state = {
            inputValue: props.defaultValue || ""
        }
    }

    onChange = (event) => {
        this.setState({
            inputValue: event.target.value
        });
    }

    componentDidMount = () => {
        this.focus();
    }

    // Focus on the input field
    focus = () => {
        this.nameInputRef.current?.focus();
    }

    setInputValue = (value) => {
        this.state.inputValue = value;
    }

    render = () => {
        return (
            <>
            <FormModal {...this.props} autocomplete="off">
                {this.props.children}
                <label htmlFor="name"></label>
                <input type="text" id="name" name="name" ref={this.nameInputRef} className="rename-input" value={this.state.inputValue} onChange={this.onChange}></input>
                <ModalButton className="half-width-button mx-5 gray-background" type="button" onClick={() => {
                    this.setState({inputValue: ""});
                    this.focus();
                }}>Clear</ModalButton>
                <ModalButton className="half-width-button mx-5 blue-background" type="submit">Apply</ModalButton>
            </FormModal>

            </>
        );
    }
}

export default RenameModal;