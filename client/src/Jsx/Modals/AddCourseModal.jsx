import React, { createRef } from "react";
import ModalButton from "./ModalComponents/ModalButton";
import DataHandler from "../../data_handling/data_handler";
import { v4 as uuidv4 } from "uuid";
import FormModal from "./Frames/FormModal";
import ModalTitle from "./ModalComponents/ModalTitle";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

class AddCourseModal extends React.Component {
    constructor (props) {
        super();

        this.nameInputRef = createRef();
        this.callback = props.callback;
    }

    onAddCourseSubmit = (e) => {
        e.preventDefault();

        const nameElement = e.target.name;
        const holesElement = e.target.holes;
        const name = nameElement.value;
        const holes = parseInt(holesElement.value);

        // Make sure they provided a valid number of holes (integer above 0)
        if(!holes || holes < 0) {
            alert("Enter a valid number of holes.");
            return;
        }
        
        // Add to Dexie
        const course = {
            courseUUID: uuidv4(),
            name: name,
            holes: holes,
            modified: Date (),
            roundCount: 0,
            // Default hole labels are 1, 2, 3, ...
            holeLabels: Array.from({ length: holes }, (_, i) => i + 1),
            data: {}
        };
        DataHandler.addCourse(course).then(() => {
            nameElement.value = "";
            holesElement.value = "";
        }).then(() => {
            this.props.onClose();
            this.callback();
        }).catch(error => {
            console.log("Couldn't add course: " + error);
        });
    }

    componentDidMount = () => {
        this.nameInputRef.current?.focus();
    }

    onClose = (e) => {
        e.preventDefault();
        // Clear fields of the form first
        // Since the buttons are wrapped in a div, the form is the
        // grandparent of the button
        e.target.parentElement.parentElement.name.value = "";
        e.target.parentElement.parentElement.holes.value = "";
        this.props.onClose();
    }

    render () {
        return (
            <FormModal onClose={this.onClose} onSubmit={this.onAddCourseSubmit}>
                <ModalTitle>Add course</ModalTitle>
                <div className="text-left">
                    <label htmlFor="name">Name: </label>
                    <input type="text" name="name" id="name" className="mb-[10px]" ref={this.nameInputRef}></input>
                </div>
                <div className="text-left">
                    <label htmlFor="holes">Holes: </label>
                    <input type="number" name="holes" id="holes" className="w-[60px] mb-[10px]"></input>
                </div>
                <div className="mt-[10px]">
                    <input type="submit" className="hidden-submit"></input>
                    <ModalButton onClick={this.onClose} className="w-[45%] bg-gray-dark text-white mx-[5px]">Cancel</ModalButton>
                    <ModalButton type="submit" className="w-[45%] bg-blue-basic text-white mx-[5px]">Add course</ModalButton>
                </div>
            </FormModal>
        );
    }
}

export default AddCourseModal;