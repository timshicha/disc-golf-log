import React from "react";
import RoundBox from "./RoundBox";
import { getRoundTotal, updateRoundScore } from "../../data_handling/round";
import TripleDotButton from "../TripleDotButton";
import "../../css/general.css";

class Round extends React.Component {
    constructor (props) {
        super();

        this.state = {
            round: props.round,
            index: props.index,
            total: 0,
            // Component showing total score for the round.
            // The logic for styling it is more complicated,
            // so using a state for it.
            totalComponent: <span>(0)</span>,
        }

        this.onOpenOptionsList = props.onOpenOptionsList;
    }

    recalculateTotal = () => {
        // New total
        const total = getRoundTotal(this.state.round);
        this.setState({
            total: total
        });

        // Generate new total component
        let newTotalComponent;
        if(total < 0) {
            newTotalComponent = <span className="green-text">({total})</span>;
        }
        else if(total === 0) {
            newTotalComponent = <span className="black-text">(0)</span>;
        }
        else {
            newTotalComponent = <span className="red-text">(+{total})</span>
        }
        this.setState({
            totalComponent: newTotalComponent
        });
    }

    componentDidMount = () => {
        // On initial render, calculate total score for the round
        this.recalculateTotal();
    }

    render () {
        return (
            <div className="margin-top-10" style={{
                fontWeight: "bold",
                width: "fit-content"
                }}>
                <div className="medium-text text-color-subtle" style={{
                    width: "90%"
                }}>
                    <div style={{
                        minWidth: "35px",
                        display: "inline-block",
                        color: "white",
                        textAlign: "center",
                        margiLeft: "3px",
                        marginRight: "3px",
                        fontWeight: "bold"
                    }} className={
                        this.state.total < 0 ? "green-background" :
                        this.state.total === 0 ? "black-background" :
                        "red-background"
                    }>
                        {this.state.total > 0 ? "+" : ""}{this.state.total}
                    </div>
                    Round {this.state.index + 1}
                    <TripleDotButton style={{
                        height: "15px",
                        float: "right"
                    }} onClick={() => {
                        this.onOpenOptionsList();
                    }}></TripleDotButton>
                </div>
                <div style={{
                    display: "inline-block",
                    width: "fit-content"
                }}>
                    <div style={{
                        width: "90%",
                        display: "flex",
                        flexWrap: "wrap",
                        justifyContent: "start",
                    }}>
                        {this.state.round.score.map((scoreValue, index) => {
                            return (
                                <RoundBox onChange={(newValue) => {
                                    updateRoundScore(this.state.round, index, newValue);
                                    this.recalculateTotal();
                                }}
                                key={index}
                                initialValue={scoreValue}
                                index={index}/>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

export default Round;