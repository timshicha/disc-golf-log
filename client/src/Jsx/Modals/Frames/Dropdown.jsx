import React, { createRef } from "react";
import "../../../css/dropdown.css";

class Dropdown extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.selectRef = createRef(null);
    }

    // Parent calls this function to get current selected option
    getValue = () => {
        return this.selectRef.current?.value;
    }

    render = () => {
        return (
            <>
                <select type="select" ref={this.selectRef} {...this.props} className={"dropdown-main " + this.props.className}>
                    {this.props.children}
                </select>
            </>
        );
    }
}

export default Dropdown;