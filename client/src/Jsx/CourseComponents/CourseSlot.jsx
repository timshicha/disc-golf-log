import React from "react";
import TripleDotButton from "../TripleDotButton";

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
            <div onClick={this.onClick} style={{
                width: "90%",
                backgroundColor: "#dddddd",
                padding: "2%",
                margin: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                fontWeight: "bold",
                fontFamily: "Arial, Helvetica, sans-serif"
            }}>
                {this.state.course.name}
                <TripleDotButton style={{
                    width: "30px",
                    float: "right"
                }}></TripleDotButton>
                <br/>
            </div>
        );
    }
}

export default CourseSlot;