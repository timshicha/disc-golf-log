import React, { createRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";
import { isValidCourseName } from "../../Utilities/format";

class RenameModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.nameInputRef = createRef();
        this.state = {
            inputValue: props.defaultValue || "",
            error: null
        };
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

    onSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        event.target.inputValue = this.state.inputValue;
        // Make sure it's a valid course name
        const validName = isValidCourseName(this.state.inputValue);
        if(!validName.isValid) {
            this.setState({ error: validName.error });
            return;
        }
        this.props.onSubmit(event);
    }

    render = () => {
        return (
            <>
            <FormModal onSubmit={this.onSubmit} onClose={this.props.onClose} onBack={this.props.onBack} replaceImg={"back-arrow"} autocomplete="off">
                {this.props.children}
                <label htmlFor="rename-course-field"></label>
                <input type="text" id="rename-course-field" name="rename-course-field"
                    autoComplete="off" ref={this.nameInputRef} className="w-[90%] my-[10px]" value={this.state.inputValue} onChange={this.onChange}>    
                </input>
                {this.state.error &&
                <div className="text-desc text-red-caution mb-[15px]">{this.state.error}</div>
                }
                <div className="mt-[10px]">
                    <ModalButton className="w-[45%] mx-[5px] bg-gray-dark text-white" type="button" onClick={() => {
                        this.setState({inputValue: ""});
                        this.focus();
                    }}>Clear</ModalButton>
                    <ModalButton className="w-[45%] mx-[5px] bg-blue-basic text-white" type="submit">Apply</ModalButton>
                </div>
            </FormModal>

            </>
        );
    }
}

export default RenameModal;