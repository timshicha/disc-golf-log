import React from "react";

class Course extends React.Component{
    constructor (props) {
        super();

        this.state = {
            name: props.name
        };

        this.onClick = props.onClick;
    }

    render = () => {
        return (
            <div onClick={this.onClick}>
                {this.state.name}
                <br></br>
            </div>
        );
    }
}

export default Course;