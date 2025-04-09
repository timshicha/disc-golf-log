import React, { useState } from "react";
import { Log } from "./data_handling/log";
import CourseComponent, { AddCourseButton, AddCourseFormComponent, CourseSlotComponent } from "./Course";

function LogComponent() {

    const [log, setLog] = useState(new Log());
    const [courseNamesHTML, setCourseNamesHTML] = useState("");
    const [nameInputValue, setNameInputValue] = useState("");
    const [courseSelected, setCourseSelected] = useState(null);
    // Whether the form for adding a course is visible or not
    const [addCourseActive, setAddCourseActive] = useState(false);

    const updateCourseNames = () => {
        const courseNames = log.getCourseNames();
        console.log(courseNames);
        setCourseNamesHTML(
            courseNames.map(name =>
                <div key={name}>
                    <CourseSlotComponent course={log.getCourse(name)} onClick={() => {
                        setCourseSelected(name);
                        setNumberOfRounds(log.getCourse(name).rounds.length);
                    }}></CourseSlotComponent>
                </div>
            )
        );
    }

    return (
        <div className="App">
            <h1>Disc golf pad</h1>

            {courseNamesHTML}

            <br />
            <p>Course selected: {courseSelected}</p>
            
            { // If form to add course is not exapanded, allow button to expand
            !addCourseActive &&
            <AddCourseButton onClick={() => {setAddCourseActive(true)}}></AddCourseButton>}
            
            { // If form to add course is expanded
            addCourseActive &&
            <AddCourseFormComponent
                onSubmit={log.addCourse}
                callback={updateCourseNames}
                onCancel={() => {setAddCourseActive(false)}}
            ></AddCourseFormComponent>}

        </div>
    );
}

export default LogComponent;