import React from "react";
import "../../css/navbar.css";
import { createPortal } from "react-dom";

const NavBar = (props) => {

    return createPortal(
        <div className="navbar">{props.children}</div>,
        document.body
    );
}

export default NavBar;