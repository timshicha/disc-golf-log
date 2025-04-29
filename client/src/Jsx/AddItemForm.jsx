import React from "react";
import "../css/forms.css";

class AddItemForm extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <form {...this.props} style={{
                width: "90%",
                marginLeft: "auto",
                marginRight: "auto",
            }} className="form-main">
                {this.props.children}
            </form>
        );
    }
}

export default AddItemForm;