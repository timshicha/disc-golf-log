import React from "react";
import { addCourse } from "../../data_handling/course";
import BlueButton from "../BlueButton";
import AddItemForm from "../AddItemForm";

class AddCourseForm extends React.Component {
    constructor (props) {
        super();

        this.state = {
            showForm: false, // Initially show "add course" button
        };

        this.callback = props.callback;
    }

    onAddCourseSubmit = (e) => {
        e.preventDefault();

        const nameElement = e.target.name;
        const holesElement = e.target.holes;

        // Add to Dexie
        addCourse(nameElement.value, parseInt(holesElement.value));
        nameElement.value = "";
        holesElement.value = "";
        this.setState({showForm: false});
        this.callback();
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
                    <AddItemForm onSubmit={this.onAddCourseSubmit}>
                        <label htmlFor="name">Name: </label>
                        <input type="text" name="name" id="name" style={{
                            marginRight: "10px",
                            marginBottom: "10px"
                        }}></input>
                        <label htmlFor="holes">Holes: </label>
                        <input type="number" name="holes" id="holes" style={{
                            width: "40px",
                        }}></input>
                        <div style={{
                            display: "block",
                            marginLeft: "auto",
                            marginRight: "auto",
                            width: "fit-content"
                        }}>
                            <BlueButton type="submit" style={{
                                margin: "10px",
                                display: "inline-block"
                            }}>Add course</BlueButton>
                            <BlueButton onClick={this.onCancel} style={{
                                margin: "10px",
                                backgroundColor: "gray",
                                display: "inline-block"
                            }}>Cancel</BlueButton>
                        </div>
                    </AddItemForm>
                : // Show button to add course
                    <BlueButton onClick={() => {this.setState({showForm: true})}}>New Course</BlueButton>
                }
            </>
        );
    }
}

export default AddCourseForm;