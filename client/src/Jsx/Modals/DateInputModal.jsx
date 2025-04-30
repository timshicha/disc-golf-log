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
        const dateInput = this.ref.current?.value;
        if(dateInput) {
            this.props.onSubmit(dateInput);
        }
        this.props.onSubmit(null);
    }

    render = () => {
        return (
            <FormModal onSubmit={this.handleSubmit} onClose={this.props.onClose}>
                <ModalTitle>Adjust Date</ModalTitle>
                <input type="date" className="width-90p" ref={this.ref}></input>
                <ModalButton type="button" className="half-width-button mx-5">Clear</ModalButton>
                <ModalButton type="submit" className="half-width-button mx-5">Apply</ModalButton>
            </FormModal>
        );
    }
}

export default DateInputModal;