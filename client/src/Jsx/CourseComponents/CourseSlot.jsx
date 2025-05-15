import React from "react";
import TripleDotButton from "../Components/TripleDotButton";

class CourseSlot extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;

        this.state = {
            course: props.course
        };

        this.props = props;
        this.onOpenOptionsList = props.onOpenOptionsList;
    }

    render = () => {
        return (
            <div onClick={this.onClick} style={{
                width: "90%",
                backgroundColor: "#dddddd",
                padding: "3%",
                margin: "10px",
                marginLeft: "auto",
                marginRight: "auto",
                borderRadius: "7px"
            }}>
                {/* Course settings button (triple dot icon) */}
                <TripleDotButton style={{
                    height: "20px",
                    float: "right",
                    cursor: "pointer",
                    marginTop: "8px"
                }} onClick={e => {
                    e.stopPropagation();
                    this.onOpenOptionsList();
                }}></TripleDotButton>
                {/* Course title */}
                <div style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    fontFamily: "Arial, Helvetica, sans-serif",
                    height: "18px"
                }}>
                    {this.state.course.name}
                </div>
                {/* Number of holes text */}
                <div style={{
                    fontSize: "12px"
                }}>
                    {this.props.course.roundCount === 1
                    ?
                    <>Played 1 time</>
                    :
                    <>Played {this.props.course.roundCount} times</>
                    }
                </div>
            </div>
        );
    }
}

export default CourseSlot;