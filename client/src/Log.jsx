import React, { useState } from "react";
import { Log } from "./data_handling/log";
import CourseComponent, { CourseSlotComponent } from "./Course";

function LogComponent() {

    const [log, setLog] = useState(new Log());
    const [courseNamesHTML, setCourseNamesHTML] = useState("");
    const [nameInputValue, setNameInputValue] = useState("");
    const [numberOfHolesInputValue, setNumberOfHolesInputValue] = useState(0);
    const [courseSelected, setCourseSelected] = useState(null);
    const [numberOfRounds, setNumberOfRounds] = useState(0);

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

            Name:
            <input
                type="text"
                value={nameInputValue}
                onChange={(event) => {
                    setNameInputValue(event.target.value);
                }}
            />
            <br />
            # of holes:
            <input
                type="number"
                value={numberOfHolesInputValue}
                onChange={(event => {
                    setNumberOfHolesInputValue(event.target.value);
                })}
            />
            <br />
            <button onClick={() => {
                log.addCourse(nameInputValue, numberOfHolesInputValue);
                setNameInputValue("");
                updateCourseNames();

            }}>
                Add course
            </button>
            <br />
            <br />
            <p>Course selected: {courseSelected}</p>
            <button onClick={() => {
                log.getCourse(courseSelected).addRound();
                setNumberOfRounds(log.getCourse(courseSelected).rounds.length);
            }}>
                Add round to selected course
            </button>

            <p>Number of rounds at selected course: {numberOfRounds}</p>
        </div>
    );
}

export default LogComponent;