import React, { createRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";
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
            <FormModal replaceImg={this.props.replaceImg} onSubmit={this.handleSubmit}
                onClose={this.props.onClose}
                onBack={this.props.onBack}
            >
                <ModalTitle>Adjust Date</ModalTitle>
                <input name={this.props.name} id={this.props.id} type="date" className="w-[220px]" ref={this.ref}></input>
                <ModalButton type="submit" className="w-[150px] mx-[5px] bg-blue-basic text-white mt-[10px]">Apply</ModalButton>
            </FormModal>
        );
    }
}

export default DateInputModal;