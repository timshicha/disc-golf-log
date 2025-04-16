import React from "react";

class ScoreSlotComponent extends React.Component {
    constructor (props) {
        super();

        this.state = {
            value: ""
        }
        this.onChange = props.onChange;
        this.state.value = props.initialValue;
    }

    setValue = (value) => {
        this.state.value = value;
    }

    render () {
        return (
            <input type="number" style={{
                width: "30px",
                height: "30px",
                fontSize: "25px",
                textAlign: "center"
            }} value={this.state.value} onChange={(self) => {
                this.onChange(self.target.value);
                this.state.value = self.target.value;
            }}>
            </input>
        );
    }
}

class RoundComponent extends React.Component {
    constructor (props) {
        super();

        this.state = {
            round: props.round
        }
        console.log(props)
    }

    render () {
        return (
            <>
            <br />
                {this.state.round.score.map((scoreValue, index) => {
                    return (
                    <ScoreSlotComponent onChange={(newValue) => {
                        this.state.round.modifyScore(index, newValue);
                        console.log(this.state.round.score)
                        this.forceUpdate();
                    }} key={index} initialValue={scoreValue}></ScoreSlotComponent>
                    );
                })}
            </>
        );
    }
}

export default RoundComponent;