import React, { useRef } from "react";
import tripleDotImg from "../../assets/images/tripleDot.svg";

class TripleDotButton extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <img src={tripleDotImg}
            {...this.props}
            >
            </img>
        );
    }
}

export default TripleDotButton;