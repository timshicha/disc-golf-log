import React, { createRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";
import "../../css/forms.css";
import ModalTitle from "./ModalComponents/ModalTitle";

class DateInputModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.ref = createRef(null);
        // onSubmit will be called with a date obj as arg 1
    }

    handleSubmit = (event) => {
        event.preventDefault();
        // If a valid date was provided, return the date
        if(this.ref.current?.value) {
            return this.props.onSubmit(this.ref.current?.value);
        }
        else {
            this.props.onSubmit(null);
        }
    }

    componentDidMount = () => {
        this.ref.current?.focus();
    }

    render = () => {
        return (
            <FormModal onSubmit={this.handleSubmit} onClose={this.props.onClose}>
                <ModalTitle>Adjust Date</ModalTitle>
                <input type="date" className="adjust-date-input" ref={this.ref}></input>
                <ModalButton type="submit" className="full-width mx-5 blue-background margin-top-10 white-text">Apply</ModalButton>
            </FormModal>
        );
    }
}

export default DateInputModal;