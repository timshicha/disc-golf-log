import React from "react";
import { addRound, getCourseRounds } from "../../data_handling/round";
import AddRoundButton from "../RoundComponents/AddRoundButton";
import Round from "../RoundComponents/Round";

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
            <button onClick={this.onBackClick}>back</button>
            <br/>
            {this.state.course.name}
            {this.state.rounds.map(round => {
                return (
                    <Round round={round} key={round.id}></Round>
                );
            })}
            <AddRoundButton onClick={() => {
                addRound(this.state.course);
                this.reloadCourseRounds();
            }}></AddRoundButton>
        </>
        );
    }
}

export default Course;