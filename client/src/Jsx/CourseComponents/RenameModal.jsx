import React from "react";
import "../../css/OptionsList.css";
import "../../css/forms.css";
import whiteX from "../../assets/images/whiteX.png";
import OptionsListButton from "../OptionsList/OptionsListButton";

class RenameModal extends React.Component {
    constructor (props) {
        super ();

        this.props = props;
        this.state = {
            inputValue: props.value || ""
        }
    }

    onChange = (event) => {
        this.setState({
            inputValue: event.target.value
        });
    }

    render = () => {
        return (
            <div className="options-list form-main rename-modal">
                {/* X-button closes the options list window */}
                <input type="image" src={whiteX}
                    onClick={this.props.onClose}
                    className="options-list-x">
                </input>
                {this.props.children}  
                <input type="text" className="rename-input" value={this.state.inputValue} onChange={this.onChange}></input>
                <OptionsListButton className="half-width-button mx-5" onClick={() => {
                    this.props.onSubmit(this.state.inputValue);
                }}>Apply</OptionsListButton>
                <OptionsListButton className="half-width-button mx-5" onClick={() => {this.setState({inputValue: ""})}}>Clear</OptionsListButton>
            </div>

        );
    }
}

export default RenameModal;