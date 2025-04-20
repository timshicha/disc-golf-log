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
                {this.state.round.score.map((scoreValue, index) => {
                    return (
                        <RoundBox onChange={(newValue) => {
                            updateRoundScore(this.state.round, index, newValue);
                        }} key={index} initialValue={scoreValue} index={index}></RoundBox>
                    );
                })}
            </>
        );
    }
}

export default Round;