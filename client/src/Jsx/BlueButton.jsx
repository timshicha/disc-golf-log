import React from "react";

class BlueButton extends React.Component {
    constructor (props) {
        super();

        this.props = props;
    }

    render = () => {
        return (
            <div {...this.props} style={{
                marginLeft: "auto",
                marginRight: "auto",
                backgroundColor: "#4a86e8",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                fontFamily: "Arial, Helvetica, sans-serif",
                padding: "10px",
                border: "none",
                borderRadius: "7px",
                cursor: "pointer",
                width: "fit-content"
            }}>
            </div>
        );
    }
}

export default BlueButton;