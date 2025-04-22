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

    render () {
        return (
            <>
                {this.state.showForm || true
                ? // Show form to add a course
                    <AddItemForm onSubmit={this.onAddCourseSubmit}>
                        <label>Course name: </label>
                        <input type="text" name="name"></input>
                        <br />
                        <label>Holes: </label>
                        <input type="number" name="holes"></input>
                        <BlueButton type="submit">Add course</BlueButton>
                    </AddItemForm>
                : // Show button to add course
                    <BlueButton onClick={() => {this.setState({showForm: true})}}>Add Course</BlueButton>
                }
            </>
        );
    }
}

export default AddCourseForm;