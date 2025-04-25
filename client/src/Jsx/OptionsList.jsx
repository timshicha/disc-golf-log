import React from "react";
import "../css/OptionsList.css";
import whiteX from "../assets/images/whiteX.png";

class OptionsList extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <div {...this.props} className="options-list">
                {/* X-button closes the options list window */}
                <input type="image" src={whiteX}
                    onClick={this.props.onClose}
                    className="options-list-x">
                </input>
                {this.props.children}  
            </div>
        );
    }
}

export default OptionsList;