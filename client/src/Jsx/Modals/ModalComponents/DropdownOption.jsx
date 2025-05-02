import React from "react";

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

export default DropdownOption;