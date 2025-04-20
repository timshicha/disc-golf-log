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
                padding: "10px",
                margin: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                fontSize: "18px",
                fontWeight: "bold",
                fontFamily: "Arial, Helvetica, sans-serif"
            }}>
                {this.state.course.name}
                <TripleDotButton style={{
                    height: "20px",
                    float: "right",
                    cursor: "pointer",
                }} onClick={e => {
                    e.stopPropagation();
                    alert("This feature is still under construction!");
                }}></TripleDotButton>
                <br/>
            </div>
        );
    }
}

export default CourseSlot;