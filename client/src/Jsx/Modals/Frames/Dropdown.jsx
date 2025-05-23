import React, { createRef } from "react";

class DropdownOption extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
    }

    render = () => {
        return (
            <option {...this.props}>
                {this.props.children}
            </option>
        );
    }
}

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
            <select type="select" ref={this.selectRef} {...this.props} className={"w-[150px] bg-gray-light text-desc text-[12px] p-[7px] mr-[10px] rounded-[7px] cursor-pointer " + this.props.className}>
                {this.props.children}
            </select>
        );
    }
}

export default Dropdown;
export { DropdownOption };