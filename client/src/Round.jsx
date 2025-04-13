import React from "react";

class RoundComponent extends React.Component {
    constructor (props) {
        super();

        this.state = {
            score: props.score ? props.score : "no score"
        }
    }

    render () {
        return (
            <>
            <br />
                {this.state.score}
            </>
        );
    }
}

export default RoundComponent;