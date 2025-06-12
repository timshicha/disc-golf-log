import React, { createRef } from "react";
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
        this.setState({
            inputValue: value
        });
    }

    onSubmit = () => {
        this.props.onSubmit(this.state.inputValue);
    }

    render = () => {
        return (
            <>
            <FormModal onSubmit={this.onSubmit} autocomplete="off">
                {this.props.children}
                <label htmlFor="rename-course-field"></label>
                <input type="text" id="rename-course-field" name="rename-course-field"
                    autoComplete="off" ref={this.nameInputRef} className="w-[90%] my-[15px]" value={this.state.inputValue} onChange={this.onChange}>    
                </input>
                <ModalButton className="w-[45%] mx-[5px] bg-gray-dark text-white" type="button" onClick={() => {
                    this.setState({inputValue: ""});
                    this.focus();
                }}>Clear</ModalButton>
                <ModalButton className="w-[45%] mx-[5px] bg-blue-basic text-white" type="submit">Apply</ModalButton>
            </FormModal>

            </>
        );
    }
}

export default RenameModal;