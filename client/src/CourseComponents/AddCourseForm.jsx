import React from "react";
import { addCourse } from "../data_handling/course";

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
        addCourse(nameElement.value, holesElement.value);
        nameElement.value = "";
        holesElement.value = "";
        this.setState({showForm: false});
        this.callback();
    }

    render () {
        return (
            <>
                {this.state.showForm
                    ? // Show form to add a course
                    <form onSubmit={this.onAddCourseSubmit}>
                        <label>Course name: </label>
                        <input type="text" name="name"></input>
                        <br />
                        <label>Holes: </label>
                        <input type="number" name="holes"></input>
                        <button type="submit">Add course</button>
                    </form>
                    : // Show button to add course
                    <button onClick={() => {this.setState({showForm: true})}}>Show form</button>
                }
            </>
        );
    }
}

export default AddCourseForm;