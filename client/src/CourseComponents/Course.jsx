import React from "react";
import { addRound, getCourseRounds } from "../data_handling/round";
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
        getCourseRounds(this.state.course).then(result => {
            this.setState({rounds: result});
        });
    }

    // Get a list of rounds for this course
    getRounds = () => {
        getR(this.state.course.id).then(result => {
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
                this.setState({rounds: getCourseRounds(this.state.course)})
            }}></AddRoundButton>
        </>
        );
    }
}

export default Course;