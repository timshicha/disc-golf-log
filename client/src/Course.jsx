import React from "react";

class CourseSlotComponent extends React.Component{
    // Parent should send Course object as course argument
    constructor (props) {
        super();

        this.state = {
            name: props.course ? props.course.name : "UNNAMED",
            numberOfHoles: props.course ? props.course.numberOfHoles : 18,
            onClick: props.onClick
        };
    }

    render () {
        return (
            <div
                style={
                    {border: "black 1px solid"}
                }
                onClick={this.state.onClick}
                onMouseEnter={event => event.target.style.cursor = "pointer"}
            >
                {this.state.name}, {this.state.numberOfHoles} holes
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

export { CourseSlotComponent };
export default CourseComponent;