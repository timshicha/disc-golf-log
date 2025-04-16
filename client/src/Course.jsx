import React, { useRef } from "react";
import RoundComponent from "./Round";
import { Round } from "./data_handling/round";

class CourseSlotComponent extends React.Component{
    // Parent should send Course object as course argument
    constructor (props) {
        super();

        this.state = {
            name: props.course ? props.course.name : "UNNAMED",
            numberOfHoles: props.course ? props.course.numberOfHoles : 18,
            onClick: props.onClick,
            onDeleteClick: props.onDeleteClick
        };
    }

    render () {
        return (
            <div
                style={{
                    border: "black 1px solid",
                    display: "block",
                    clear: "both"
                }}
                onClick={this.state.onClick}
                onMouseEnter={event => event.target.style.cursor = "pointer"}
            >
                {this.state.name}, {this.state.numberOfHoles} holes
                <button style={{float: "right"}} onClick={this.state.onDeleteClick}>Delete</button>
            </div>
        );
    }
}

class AddCourseButton extends React.Component {
    constructor (props) {
        super();

        this.state = {
            onClick: props.onClick
        }
    }

    render () {
        return (
            <button onClick={this.state.onClick}>
                Add Course
            </button>
        );
    }
}

class AddCourseFormComponent extends React.Component {
    constructor (props) {
        super();

        this.state = {
            onSubmit: props.onSubmit,
            callback: props.callback,
            onCancel: props.onCancel,
            courseNameInputValue: "",
            numberOfHolesInputValue: 0
        };

        this.courseNameInputValueRef = React.createRef();
        this.numberOfHolesInputValueRef = React.createRef();
        
    }

    render () {
        return (
            <div>
                Course name:
                <input
                    type="text"
                    ref={this.courseNameInputValueRef}
                    onChange={(event) => {
                        this.state.courseNameInputValue = event.target.value;
                    }}
                ></input>
                <br />
                Number of holes:
                <input
                    type="number"
                    ref={this.numberOfHolesInputValueRef}
                    onChange={(event) => {
                        this.state.numberOfHolesInputValue = event.target.value;
                    }}
                ></input>
                <br />
                <button onClick={() => {
                    if(this.state.onSubmit) {
                        this.state.onSubmit(this.state.courseNameInputValue, this.state.numberOfHolesInputValue);
                    }
                    if(this.state.callback) {
                        this.state.courseNameInputValue = "";
                        this.courseNameInputValueRef.current.value = "";
                        this.state.callback();
                    }
                }}>Add Course</button>
                <button onClick={() => {
                    if(this.state.onCancel) {
                        this.state.onCancel();
                    }
                }}>Cancel</button>

            </div>
        );
    }
}

class CourseComponent extends React.Component{
    constructor (props) {
        super();
        this.state = {
            course: props.course,
            onClick: props.onClick,
            onCloseClick: props.onCloseClick,
            roundsHTML: "",
            toggle: false
        };
    }

    render () {
        console.log(this.state);
        return (
            <>
                <button onClick={this.state.onCloseClick}>Back</button>
                <br />
                Course name: {this.state.course.name}
                <br />

                Rounds:
                <br />
                {this.state.course.rounds.map((roundName) => {
                    // Look for the json file
                    const roundJson = localStorage.getItem(roundName + ".json");
                    let round = null;
                    if(roundJson) {
                        round = new Round(JSON.parse(roundJson));
                    }
                    return (
                        <RoundComponent round={round} key={roundName}></RoundComponent>
                    );
                })}

                <br />
                <button onClick={() => {
                    this.state.course.addRound();
                    this.forceUpdate();
                }}>Add Round</button>
            </>
        );
    }
}

export { CourseSlotComponent, AddCourseButton, AddCourseFormComponent };
export default CourseComponent;