import React, { createRef } from "react";
import "../../css/OptionsList.css";
import "../../css/forms.css";
import OptionsListButton from "../OptionsList/OptionsListButton";
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

    componentDidUpdate = () => {
        this.nameInputRef.current?.focus();
    }

    render = () => {
        return (
            <form {...this.props} style={{
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
            }} className="form-main options-list rename-modal"
                onSubmit={this.props.onSubmit}>
                <CloseX onClick={this.props.onClose}></CloseX>
                {this.props.children}
                <label htmlFor="name"></label>
                <input type="text" id="name" name="name" ref={this.nameInputRef} className="rename-input" value={this.state.inputValue} onChange={this.onChange}></input>
                <OptionsListButton className="half-width-button mx-5" type="submit">Apply</OptionsListButton>
                <OptionsListButton className="half-width-button mx-5" type="button" onClick={() => {this.setState({inputValue: ""})}}>Clear</OptionsListButton>
            </form>
        );
    }
}

export default RenameModal;