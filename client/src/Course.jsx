import React, { useRef } from "react";

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
            name: props.name,
            onClick: props.onClick
        };
    }

    render () {
        console.log(this.state);
        return (
            <div key={this.state.name}>
                <p>{this.state.name}</p>
                <button onClick={this.state.onClick}>Select</button>
            </div>
        );
    }
}

export { CourseSlotComponent, AddCourseButton, AddCourseFormComponent };
export default CourseComponent;