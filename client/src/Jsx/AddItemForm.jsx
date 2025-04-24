import React from "react";
import "../css/addItemForm.css";

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
            }} className="add-item-form">
                {this.props.children}
            </form>
        );
    }
}

export default AddItemForm;