import React from "react";
import { addRound, deleteRound, getCourseRounds, updateRoundDate } from "../../data_handling/round";
import Round from "../RoundComponents/Round";
import BlueButton from "../Components/BlueButton";
import backCarrot from "../../assets/images/backCarrot.png";
import "../../css/general.css";
import MenuModal from "../Modals/Frames/MenuModal";
import ModalButton from "../Modals/ModalComponents/ModalButton";
import ModalTitle from "../Modals/ModalComponents/ModalTitle";
import DateInputModal from "../Modals/DateInputModal";

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
            roundSelectedIndex: null,
            showDateInputModal: false
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
            {/* If the date input modal is shown */}
            {this.state.showDateInputModal ?
                <DateInputModal onSubmit={(newDate) => {
                        // Make sure new date is not null
                        if(newDate) {
                            updateRoundDate(this.state.rounds[this.state.roundSelectedIndex], newDate);
                            this.setState({
                                showDateInputModal: false,
                                roundSelectedIndex: null
                            });
                        }
                    }}
                    onClose={() => {
                        this.setState({showDateInputModal: false});
                    }}
                >
                </DateInputModal> :
                <>
                {/* Otherwise, if a round is selected, show the option modal. */}
                {this.state.roundSelectedIndex !== null &&
                    <MenuModal onClose={() => {
                        this.setState({roundSelectedIndex: null});
                    }}>
                        <ModalTitle>Round {this.state.roundSelectedIndex + 1}</ModalTitle>
                        <ModalButton className="full-width black-text" onClick={() => {
                                this.setState({showDateInputModal: true});
                            }}>Adjust date
                        </ModalButton>
                        <ModalButton onClick={() => {
                            console.log("Deleting round");
                            deleteRound(this.state.rounds[this.state.roundSelectedIndex]);
                            this.setState({
                                rounds: this.state.rounds.filter((_, index) => index !== this.state.roundSelectedIndex),
                                roundSelectedIndex: null
                            })

                            this.forceUpdate();

                        }} className="full-width caution-button">Delete round</ModalButton>
                    </MenuModal>
                }
                </>
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
                        onOpenModal={() => {
                            this.setState({
                                roundSelectedIndex: index
                            });
                        }}
                    >
                    </Round>
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