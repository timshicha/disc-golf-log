import React from "react";

class AddRoundButton extends React.Component {
    constructor (props) {
        super();

        this.onClick = props.onClick;
    }

    render = () => {
        return (
            <>
                <button onClick={this.onClick}>Add round</button>
            </>
        );
    }
}

export default AddRoundButton;