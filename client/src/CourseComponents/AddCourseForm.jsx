import React from "react";
import { addCourse } from "../data_handling/course";

class AddCourseForm extends React.Component {
    constructor (props) {
        super();

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
        this.callback();
    }

    render () {
        return (
            <>
                <form onSubmit={this.onAddCourseSubmit}>
                    <label>Course name: </label>
                    <input type="text" name="name"></input>
                    <br />
                    <label>Holes: </label>
                    <input type="number" name="holes"></input>
                    <button type="submit">Add course</button>
                </form>
            </>
        );
    }
}

export default AddCourseForm;