import React, { useState } from "react";
import { Log } from "./data_handling/log";
import Course from "./Course";

function App() {

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
                    <Course name={name} onClick={() => {
                        setCourseSelected(name);
                        setNumberOfRounds(log.getCourse(name).getNumberOfRounds());
                    }}></Course>
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
                setNumberOfRounds(log.getCourse(courseSelected).getNumberOfRounds());
            }}>
                Add round to selected course
            </button>

            <p>Number of rounds at selected course: {numberOfRounds}</p>

        </div>
    );
}

export default App;