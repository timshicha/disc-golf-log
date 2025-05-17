import React from "react";
import backCarrot from "../../assets/images/backCarrot.png";
import "../../css/navbar.css";

const BackButton = (props) => {
    return (
        <input type="image" onClick={props.onClick}
            src={backCarrot} className="navbar-back-button">
        </input>
    );
}

export default BackButton;