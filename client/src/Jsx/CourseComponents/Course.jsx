import React from "react";
import { addRound, getCourseRounds } from "../../data_handling/round";
import Round from "../RoundComponents/Round";
import BlueButton from "../BlueButton";
import backCarrot from "../../assets/images/backCarrot.png";

class Course extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;
        this.onBackClick = props.onBackClick;

        this.state = {
            course: props.course,
            rounds: []
        };
    }

    // On initial render
    componentDidMount = () => {
        // Load rounds from Dexie
        this.reloadCourseRounds();
    }

    // Get a list of rounds for this course
    reloadCourseRounds = () => {
        getCourseRounds(this.state.course).then(result => {
            this.setState({rounds: result});
        });
    }

    render = () => {
        return (
            <>
            <input type="image" onClick={this.onBackClick}
                src={backCarrot} style={{
                top: "10px",
                width: "30px",
                position: "absolute",
                backgroundColor: "#dddddd",
                padding: "5px",
                borderRadius: "7px"
            }}></input>
            <h1 className="h-main">{this.state.course.name}</h1>
            {this.state.rounds.map(round => {
                return (
                    <Round round={round} key={round.id}></Round>
                );
            })}
            <BlueButton onClick={() => {
                addRound(this.state.course);
                this.reloadCourseRounds();
            }}>Add Round</BlueButton>
        </>
        );
    }
}

export default Course;