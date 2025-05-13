import React, { createRef } from "react";
import { addRound, deleteRound, getCourseRounds, updateRound } from "../../data_handling/round";
import Round from "../RoundComponents/Round";
import BlueButton from "../Components/BlueButton";
import backCarrot from "../../assets/images/backCarrot.png";
import "../../css/general.css";
import MenuModal from "../Modals/Frames/MenuModal";
import ModalButton from "../Modals/ModalComponents/ModalButton";
import ModalTitle from "../Modals/ModalComponents/ModalTitle";
import DateInputModal from "../Modals/DateInputModal";
import ServerQueue from "../../serverCalls/ServerQueue";
import { v4 as uuidv4 } from "uuid";

class Course extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;
        this.onBackClick = props.onBackClick;

        this.roundsDivRef = createRef(null);

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
        getCourseRounds(this.state.course.courseUUID).then(result => {
            this.setState({rounds: result});
        });
    }

    scrollToBottom = () => {
        if(this.roundsDivRef.current) {
            this.roundsDivRef.current.scrollTop = this.roundsDivRef.current.scrollHeight;
        }
    }

    render = () => {
        return (
        <>
            {/* If the date input modal is shown */}
            {this.state.showDateInputModal ?
                <DateInputModal onSubmit={(newDate) => {
                        // Make sure new date is not null
                        if(newDate) {
                            this.state.rounds[this.state.roundSelectedIndex].date = newDate;
                            // Update the round (date)
                            updateRound(this.state.rounds[this.state.roundSelectedIndex]);
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
                        <ModalButton className="full-width black-text gray-background" onClick={() => {
                                this.setState({showDateInputModal: true});
                            }}>Adjust date
                        </ModalButton>
                        <ModalButton onClick={() => {
                            console.log("index: " + this.state.roundSelectedIndex);
                            ServerQueue.deleteRound(this.state.rounds[this.state.roundSelectedIndex]);
                            deleteRound(this.state.rounds[this.state.roundSelectedIndex]);
                            this.setState({
                                rounds: this.state.rounds.filter((_, index) => index !== this.state.roundSelectedIndex),
                                roundSelectedIndex: null
                            });

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
            <div id="rounds-div" ref={this.roundsDivRef}>
                {this.state.rounds.map((round, index) => {
                    return (
                        <Round round={round} key={round.id || index} index={index}
                            // When the user clicks on the triple dot icon
                            // on this round
                            onOpenModal={(index) => {
                                this.setState({
                                    roundSelectedIndex: index
                                });
                            }}
                        >
                        </Round>
                    );
                })}
            </div>
            <BlueButton onClick={() => {
                const roundUUID = uuidv4();
                const newRound = {
                    courseUUID: this.state.course.courseUUID,
                    roundUUID: roundUUID,
                    holes: this.state.course.holes,
                    score: Array(this.state.course.holes).fill(""),
                    date: Date()
                };
                addRound(newRound).then(() => {
                    ServerQueue.addRound(newRound);
                    this.reloadCourseRounds();
                    // Scroll to bottom
                    this.scrollToBottom();
                });
            }} className="margin-top-10 fixed-bottom-button">Add Round</BlueButton>
        </>
        );
    }
}

export default Course;