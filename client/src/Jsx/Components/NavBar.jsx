import React from "react";
import "../../css/navbar.css";
import { createPortal } from "react-dom";

const NavBar = (props) => {

    return createPortal(
        <div className={"h-[58px] w-[100%] fixed top-[0px] bg-[#ff8f8f] py-[5px] flex justify-between " + props.className}>{props.children}</div>,
        document.body
    );
}

export default NavBar;