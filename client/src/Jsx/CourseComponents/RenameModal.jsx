import React, { createRef } from "react";
import "../../css/OptionsList.css";
import "../../css/forms.css";
import OptionsListButton from "../OptionsList/OptionsListButton";
import OptionsList from "../OptionsList/OptionsList";
import CloseX from "./CloseX";

class RenameModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.nameInputRef = createRef();
        this.state = {
            inputValue: props.value || ""
        }
    }

    onChange = (event) => {
        this.setState({
            inputValue: event.target.value
        });
    }

    componentDidMount = () => {
        this.nameInputRef.current?.focus();
    }

    render = () => {
        return (
            <>
            <OptionsList {...this.props}>
                <CloseX onClick={this.props.onClose}></CloseX>
                {this.props.children}
                <label htmlFor="name"></label>
                <input type="text" id="name" name="name" ref={this.nameInputRef} className="rename-input" value={this.state.inputValue} onChange={this.onChange}></input>
                <OptionsListButton className="half-width-button mx-5" type="submit">Apply</OptionsListButton>
                <OptionsListButton className="half-width-button mx-5" type="button" onClick={() => {this.setState({inputValue: ""})}}>Clear</OptionsListButton>
            </OptionsList>

            </>
        );
    }
}

export default RenameModal;