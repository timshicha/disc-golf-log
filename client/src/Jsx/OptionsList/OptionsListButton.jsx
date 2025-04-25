import React from "react";

class OptionsListButton extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <button {...this.props} className={"options-list-button " + this.props.className}>
                {this.props.children}
            </button>
        );
    }
}

export default OptionsListButton;