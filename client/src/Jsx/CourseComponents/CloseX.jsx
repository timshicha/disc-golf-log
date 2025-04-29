import React from "react";
import whiteX from "../../assets/images/whiteX.png";


class CloseX extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <button type="button" onClick={this.props.onClick} className="close-x-button">
                <img src={whiteX} className="close-x-img"></img>
            </button>
        );
    }
}

export default CloseX;