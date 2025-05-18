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
        DataHandler.getCourseRounds(this.state.course).then(result => {
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
            {/* If the date input modal is shown */}
            {this.state.showDateInputModal ?
                <DateInputModal onSubmit={(newDate) => {
                        // Make sure new date is not null
                        if(newDate) {
                            this.state.rounds[this.state.roundSelectedIndex].date = newDate;
                            // Update the round (date)
                            DataHandler.modifyRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
                                this.setState({
                                    showDateInputModal: false,
                                    roundSelectedIndex: null
                                });
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
                            DataHandler.deleteRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
                                this.setState({
                                    rounds: this.state.rounds.filter((_, index) => index !== this.state.roundSelectedIndex),
                                    roundSelectedIndex: null
                                });
                                this.forceUpdate();
                            })

                        }} className="full-width caution-button">Delete round</ModalButton>
                    </MenuModal>
                }
                </>
            }
            <BackButton onClick={() => this.props.navigateTo("main")}></BackButton>

            <h1 className="h-main">{this.state.course.name}</h1>
            <div id="rounds-div" ref={this.roundsDivRef}>
                {this.state.rounds.map((round, index) => {
                    return (
                        <Round round={round} course={this.state.course} key={round.id || index} index={index}
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
            {/* There is an "Add round" at the bottom of the page. This
            may cover the rounds at the bottom, so add blank space at the
            bottom. This way, the user can scroll all the way to the bottom
            round and the blank space is what is covered under the button. */}
            <BlankSpace height="150px"></BlankSpace>
            <BlueButton onClick={() => {
                const roundUUID = uuidv4();
                const newRound = {
                    courseUUID: this.state.course.courseUUID,
                    roundUUID: roundUUID,
                    holes: this.state.course.holes,
                    score: Array(this.state.course.holes).fill(""),
                    date: (new Date()).toISOString()
                };
                DataHandler.addRound(newRound, this.state.course, true).then(() => {
                    this.reloadCourseRounds();
                    // Scroll to bottom
                    this.scrollToBottom();
                });
            }} className="margin-top-10 fixed-bottom-button">Add Round</BlueButton>
        </div>
        );
    }
}

export default CoursePage;