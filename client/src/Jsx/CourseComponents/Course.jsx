import React from "react";
import { addRound, getCourseRounds } from "../../data_handling/round";
import Round from "../RoundComponents/Round";
import BlueButton from "../BlueButton";
import backCarrot from "../../assets/images/backCarrot.png";
import "../../css/general.css";
import OptionsList from "../OptionsList";

class Course extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;
        this.onBackClick = props.onBackClick;

        this.state = {
            course: props.course,
            rounds: [],
            // Which round the options list is opened for,
            // if it is open
            optionsListOpenFor: null
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
            {this.state.optionsListOpenFor ?
                <OptionsList onClose={() => {
                    this.setState({optionsListOpenFor: null});
                }}>

                </OptionsList> :
                null
            }
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
            {this.state.rounds.map((round, index) => {
                return (
                    <Round round={round} key={round.id} index={index}
                        // When the user clicks on the triple dot icon
                        // on this round
                        onOpenOptionsList={() => {
                            this.setState({optionsListOpenFor: round});
                    }}></Round>
                );
            })}
            <BlueButton onClick={() => {
                addRound(this.state.course);
                this.reloadCourseRounds();
            }} className="margin-top-10">Add Round</BlueButton>
        </>
        );
    }
}

export default Course;