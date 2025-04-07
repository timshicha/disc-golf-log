import React from "react";


class Course extends React.Component{
    constructor (props) {
        super();
        this.state = {
            name: props.name
        };
        console.log(typeof name)
    }

    render () {
        console.log(this.state);
        return (
            <div key={this.state.name}>
                <p>{this.state.name}</p>
            </div>
        );
    }
}

export default Course;