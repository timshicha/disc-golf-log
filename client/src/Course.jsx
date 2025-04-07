import React from "react";


class Course extends React.Component{
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

export default Course;