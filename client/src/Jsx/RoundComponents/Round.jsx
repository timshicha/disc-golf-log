import React from "react";
import RoundBox from "./RoundBox";
import { updateRoundScore } from "../../data_handling/round";

class Round extends React.Component {
    constructor (props) {
        super();

        this.state = {
            round: props.round
        }
    }

    render () {
        return (
            <>
            <br />
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
                        }} key={index} initialValue={scoreValue} index={index}></RoundBox>
                    );
                })}
            </div>
            </>
        );
    }
}

export default Round;