import React from "react";
import whiteX from "../../../assets/images/whiteX.png";


class CloseX extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <button type="button" onClick={this.props.onClick} className="absolute right-[10px] top-[5px] p-[5px] bg-transparent cursor-pointer">
                <img src={whiteX} className="w-[20px]"></img>
            </button>
        );
    }
}

export default CloseX;