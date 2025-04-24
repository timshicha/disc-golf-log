import React from "react";
import RoundBox from "./RoundBox";
import { updateRoundScore } from "../../data_handling/round";
import "../../css/general.css";

class Round extends React.Component {
    constructor (props) {
        super();

        this.state = {
            round: props.round,
            index: props.index
        }
    }

    render () {
        return (
            <div className="margin-top-5">
            <div className="small-text text-color-semi-subtle">
                Round {this.state.index + 1}
            </div>
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
                        }}
                        key={index}
                        initialValue={scoreValue}
                        index={index}/>
                    );
                })}
            </div>
            </div>
        );
    }
}

export default Round;