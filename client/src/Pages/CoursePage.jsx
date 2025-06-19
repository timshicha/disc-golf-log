import React, { createRef } from "react";
import Round from "../Jsx/Components/Round";
import ModalButton from "../Jsx/Modals/ModalComponents/ModalButton";
import DataHandler from "../DataHandling/DataHandler";
import { v4 as uuidv4 } from "uuid";
import { compareStrings } from "../Utilities/sorting";
import { toLocalIsoString } from "../Utilities/dates";
import StickyDiv from "../Jsx/Components/StickyDiv";
import { Modals } from "../Utilities/Enums";
import RoundOptionsModal from "../Jsx/Modals/RoundOptionsModal";

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
            this.setState({rounds: result});
        });
    }

    scrollToBottom = () => {
        if(this.roundsDivRef.current) {
            this.roundsDivRef.current.scrollTop = this.roundsDivRef.current.scrollHeight;
        }
    }

    updateRoundDate = (newDate) => {
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
    }

    updateRoundComments = (comments) => {
        this.state.rounds[this.state.roundSelectedIndex].comments = comments;
        DataHandler.modifyRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
            this.setState({
                currentModal: null,
                roundSelectedIndex: null
            });
        })
    }

    deleteSelectedRound = () => {
        DataHandler.deleteRound(this.state.rounds[this.state.roundSelectedIndex], this.state.course, true).then(() => {
            this.setState({
                rounds: this.state.rounds.filter((_, index) => index !== this.state.roundSelectedIndex),
                roundSelectedIndex: null,
                currentModal: null
            });
            this.forceUpdate();
        });
    }

    render = () => {
        return (
        <div className="mt-[60px]">
            {this.state.currentModal === Modals.ROUND_OPTIONS &&
                <RoundOptionsModal roundIndex={this.state.roundSelectedIndex}
                    round={this.state.rounds[this.state.roundSelectedIndex]}
                    onClose={() => this.setState({ currentModal: null })}
                    onUpdateDate={this.updateRoundDate}
                    onUpdateComments={this.updateRoundComments}
                    onDeleteRound={this.deleteSelectedRound}
                >
                </RoundOptionsModal>
            }
            
            <div className="overflow-y-scroll overflow-x-hidden [overflow-anchor:bottom] m-[5px] h-[calc(100dvh-100px)]" ref={this.roundsDivRef}>
                {this.state.rounds.sort((a, b) => compareStrings(a.date, b.date)).map((round, index) => {
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
                <div className="h-[200px]"></div>
            </div>
            {/* There is an "Add round" at the bottom of the page. This
            may cover the rounds at the bottom, so add blank space at the
            bottom. This way, the user can scroll all the way to the bottom
            round and the blank space is what is covered under the button. */}
            <StickyDiv className="text-center">
                <ModalButton className="bg-blue-basic text-white mx-auto" onClick={() => {
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
                }}>Add Round</ModalButton>
            </StickyDiv>
        </div>
        );
    }
}

export default CoursePage;