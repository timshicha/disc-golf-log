import React, { useRef } from "react";
import tripleDotImg from "../../assets/images/tripleDot.svg";

class TripleDotButton extends React.Component {
    constructor (props) {
        super(props);

        this.props = props;
    }

    render = () => {
        return (
            <div {...this.props}>
                <img src={tripleDotImg} className="w-full" alt={this.props.alt ? this.props.alt : "Options"}>
                </img>
                <span className="relative after:absolute after:-inset-[10px] after:content-[''] bg-red-400"></span>
            </div>
        );
    }
}

export default TripleDotButton;