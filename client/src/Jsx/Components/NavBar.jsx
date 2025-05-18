import React from "react";
import "../../css/navbar.css";

const NavBar = (props) => {

    return (
        <div className="navbar">{props.children}</div>
    );
}

export default NavBar;