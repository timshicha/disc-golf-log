import React, { useState } from "react";
import { Log } from "./data_handling/log";
import Course from "./Course";

function App() {

    const [log, setLog] = useState(new Log());
    const [courseNamesHTML, setCourseNamesHTML] = useState("");
    const [nameInputValue, setNameInputValue] = useState("");
    const [courseSelected, setCourseSelected] = useState(null);

    const updateCourseNames = () => {
        const courseNames = log.getCourseNames();
        console.log(courseNames);
        setCourseNamesHTML(
            courseNames.map(name =>
                <div key={name}>
                    <Course name={name} onClick={() => {
                        setCourseSelected(name);
                    }}></Course>
                </div>
            )
        );
    }

    return (
        <div className="App">
            <h1>Disc golf pad</h1>

            {courseNamesHTML}

            <input
                type="text"
                value={nameInputValue}
                onChange={(event) => {
                    setNameInputValue(event.target.value);
                }}
            />
            <button onClick={() => {
                log.addCourse(nameInputValue);
                setNameInputValue("");
                updateCourseNames();

            }}>
                Add course
            </button>
        </div>
    );
}

export default App;