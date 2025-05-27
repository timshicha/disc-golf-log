import React, { useRef } from "react";
import tripleDotImg from "../../assets/images/tripleDot.svg";

class TripleDotButton extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;
    }

    render = () => {
        return (
            <img src={tripleDotImg} {...this.props} className={this.props.className}>
            </img>
        );
    }
}

export default TripleDotButton;