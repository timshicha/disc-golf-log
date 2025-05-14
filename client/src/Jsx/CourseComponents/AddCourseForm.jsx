import React, { createRef } from "react";
import { addCourse } from "../../data_handling/course";
import BlueButton from "../Components/BlueButton";
import ModalButton from "../Modals/ModalComponents/ModalButton";
import DataHandler from "../../data_handling/data_handler";
import { v4 as uuidv4 } from "uuid";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

class AddCourseForm extends React.Component {
    constructor (props) {
        super();

        this.state = {
            showForm: false, // Initially show "add course" button
        };

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
            modified: Date ()
        };
        DataHandler.addCourse(course).then(() => {
            nameElement.value = "";
            holesElement.value = "";
            this.setState({showForm: false});
        });
        this.callback();
    }

    componentDidUpdate = () => {
        this.nameInputRef.current?.focus();
    }

    onCancel = (e) => {
        e.preventDefault();
        // Clear fields of the form...
        // Since the buttons are wrapped in a div, the form is the
        // grandparent of the button
        e.target.parentElement.parentElement.name.value = "";
        e.target.parentElement.parentElement.holes.value = "";
        this.setState({showForm: false});
    }

    render () {
        return (
            <>
                {this.state.showForm
                ? // Show form to add a course
                    <form onSubmit={this.onAddCourseSubmit} style={{
                        width: "90%",
                        marginLeft: "auto",
                        marginRight: "auto",
                    }} className="form-main">
                        <div className="form-input-block">
                            <label htmlFor="name">Name: </label>
                            <input type="text" name="name" id="name" style={{
                                marginRight: "10px",
                                marginBottom: "10px"
                            }} ref={this.nameInputRef}></input>
                        </div>
                        <div className="form-input-block">
                            <label htmlFor="holes">Holes: </label>
                            <input type="number" name="holes" id="holes" style={{
                                width: "40px",
                            }}></input>
                        </div>
                        <div>
                            <input type="submit"></input>
                            <ModalButton onClick={this.onCancel} className="half-width-button gray-background mx-5">Cancel</ModalButton>
                            <ModalButton type="submit" className="half-width-button blue-background mx-5">Add course</ModalButton>
                        </div>
                    </form>
                : // Show button to add course
                    <BlueButton onClick={() => {this.setState({showForm: true})}}>New Course</BlueButton>
                }
            </>
        );
    }
}

export default AddCourseForm;