import React, { createRef } from "react";
import Round from "./Components/Round";
import BlueButton from "./Components/BlueButton";
import "../css/general.css";
import MenuModal from "./Modals/Frames/MenuModal";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import ModalTitle from "./Modals/ModalComponents/ModalTitle";
import DateInputModal from "./Modals/DateInputModal";
import DataHandler from "../data_handling/data_handler";
import { v4 as uuidv4 } from "uuid";
import BackButton from "./Components/BackButton";
import BlankSpace from "./Components/BlankSpace";
import { compareStrings } from "../js_utils/sorting";
import { toLocalIsoString } from "../js_utils/dates";
import StickyDiv from "./Components/StickyDiv";
import { Modals } from "../js_utils/Enums";
import CommentModal from "./Modals/CommentModal";

class CoursePage extends React.Component{
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
            currentModal: null,
        };

    }

    // On initial render
    componentDidMount = () => {
        // Load rounds from Dexie
        this.reloadCourseRounds();
    }

    // Get a list of rounds for this course
    reloadCourseRounds = () => {
        DataHandler.getCourseRounds(this.state.course).then(result => {
            // Sort the rounds by date
            result.sort((a, b) => compareStrings(a.date, b.date));
            console.log(result);
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
        <div className="course-page">
            {this.state.currentModal === Modals.ROUND_OPTIONS &&
                <MenuModal onClose={() => {
                    this.setState({currentModal: null});
                }}>
                    <ModalTitle>Round {this.state.roundSelectedIndex + 1}</ModalTitle>
                    <ModalButton className="full-width gray-background margin-top-10 white-text" onClick={() => {
                        this.setState({currentModal: Modals.DATE_INPUT});
                    }}>Adjust date
                    </ModalButton>
                    <ModalButton className="full-width gray-background margin-top-10 white-text" onClick={() => {
                        this.setState({currentModal: Modals.COMMENTS});
                    }}>Add comment</ModalButton>
                    <ModalButton onClick={() => {
                        DataHandler.deleteRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
                            this.setState({
                                rounds: this.state.rounds.filter((_, index) => index !== this.state.roundSelectedIndex),
                                roundSelectedIndex: null
                            });
                            this.forceUpdate();
                        })
                        
                    }} className="full-width caution-button margin-top-10 white-text">Delete round</ModalButton>
                </MenuModal>
            }
            {/* If the date input modal is shown */}
            {this.state.currentModal === Modals.DATE_INPUT &&
                <DateInputModal onSubmit={(newDate) => {
                        // Make sure new date is not null
                        if(newDate) {
                            this.state.rounds[this.state.roundSelectedIndex].date = newDate;
                            // Update the round (date)
                            DataHandler.modifyRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
                                this.setState({
                                    currentModal: null,
                                    roundSelectedIndex: null
                                });
                            });
                        }
                    }}
                    onClose={() => {
                        this.setState({currentModal: Modals.ROUND_OPTIONS});
                    }}
                >
                </DateInputModal>
            }
            {/* If the "add comments" modal is open */}
            {this.state.currentModal === Modals.COMMENTS &&
                <CommentModal onSubmit={(comments) => {
                    this.state.rounds[this.state.roundSelectedIndex].comments = comments;
                    DataHandler.modifyRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
                        this.setState({
                            currentModal: null,
                            roundSelectedIndex: null
                        });
                    })
                }} onClose={() => {
                    this.setState({currentModal: Modals.ROUND_OPTIONS})
                }} initialValue={this.state.rounds[this.state.roundSelectedIndex].comments}>
                </CommentModal>
            }
            
            <div id="rounds-div" ref={this.roundsDivRef}>
                {this.state.rounds.map((round, index) => {
                    return (
                        <Round round={round} course={this.state.course} key={round.roundUUID} index={index}
                            // When the user clicks on the triple dot icon
                            // on this round
                            onOpenModal={(index) => {
                                this.setState({
                                    roundSelectedIndex: index,
                                    currentModal: Modals.ROUND_OPTIONS
                                });
                            }}
                        >
                        </Round>
                    );
                })}
                <BlankSpace height="200px"></BlankSpace>
            </div>
            {/* There is an "Add round" at the bottom of the page. This
            may cover the rounds at the bottom, so add blank space at the
            bottom. This way, the user can scroll all the way to the bottom
            round and the blank space is what is covered under the button. */}
            <StickyDiv>
                <BlueButton onClick={() => {
                    const roundUUID = uuidv4();
                    const newRound = {
                        courseUUID: this.state.course.courseUUID,
                        roundUUID: roundUUID,
                        holes: this.state.course.holes,
                        score: Array(this.state.course.holes).fill(""),
                        date: toLocalIsoString(), // Created an iso string of current local time
                        data: {}
                    };
                    DataHandler.addRound(newRound, this.state.course, true).then(() => {
                        this.reloadCourseRounds();
                        // Scroll to bottom
                        this.scrollToBottom();
                    });
                }}>Add Round</BlueButton>
            </StickyDiv>
        </div>
        );
    }
}

export default CoursePage;