import React, { useState } from "react";
import { Log } from "./data_handling/log";

function App() {

    const [log, setLog] = useState(new Log());
    const [courseNames, setCourseNames] = useState("");
    const [nameInputValue, setNameInputValue] = useState("");

    return (
        <div className="App">
            <h1>Disc golf pad</h1>
            <p>{courseNames}</p>
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

                setCourseNames(log.getCourseNames());
            }}>
                Add course
            </button>
        </div>
    );
}

export default App;