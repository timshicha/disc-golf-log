import React from "react";

class CourseSlot extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;

        this.state = {
            course: props.course
        };
    }

    render = () => {
        return (
            <div onClick={this.onClick}>
                {this.state.course.name}
                <br/>
            </div>
        );
    }
}

export default CourseSlot;