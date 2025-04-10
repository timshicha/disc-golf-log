import React, { useEffect, useState } from "react";
import { Log } from "./data_handling/log";
import CourseComponent, { AddCourseButton, AddCourseFormComponent, CourseSlotComponent } from "./Course";

function LogComponent() {

    const [log, setLog] = useState(new Log());
    const [courseNamesHTML, setCourseNamesHTML] = useState("");
    const [courseSelected, setCourseSelected] = useState(null);
    // Whether the form for adding a course is visible or not
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);

    // Initial Setup
    useEffect (() => {
        // Log may already have courses in it
        updateCourseNames();
    }, []);

    const updateCourseNames = () => {
        const courseNames = log.getCourseNames();
        setCourseNamesHTML(
            courseNames.map(name =>
                <div key={name}>
                    <CourseSlotComponent course={log.getCourse(name)} onClick={() => {
                        setCourseSelected(name);
                    }} onDeleteClick={() => {
                        if(confirm("Delete course and all of its rounds?")) {
                            log.deleteCourse(name);
                            updateCourseNames();
                        }
                    }}></CourseSlotComponent>
                </div>
            )
        );
    }

    return (
        <div className="App">
            <h1>Disc golf pad</h1>

            { // If a course is selected, do not show the list of courses
            !courseSelected &&
            <>
                {courseNamesHTML}
                <br />
                { // If form to add course is not exapanded, allow button to expand
                !showAddCourseForm &&
                <AddCourseButton onClick={() => {setShowAddCourseForm(true)}}></AddCourseButton>}
                { // If form to add course is expanded
                showAddCourseForm &&
                <AddCourseFormComponent
                    onSubmit={log.addCourse}
                    callback={() => {
                        updateCourseNames();
                        setShowAddCourseForm(false);
                    }}
                    onCancel={() => {setShowAddCourseForm(false)}}
                ></AddCourseFormComponent>}
            </>
            }

            { // If a course is selected, then show the course
            courseSelected &&
            <CourseComponent
                course={log.courses[courseSelected]}
                onCloseClick={() => {
                setCourseSelected(null);
            }}
            >
            </CourseComponent>
            }
        </div>
    );
}

export default LogComponent;