import React from "react";
import { createPortal } from "react-dom";
import backCarrot from "../../assets/images/backCarrot.png";

const NavBarBackButton = (props) => {
    return (
        <input type="image" onClick={props.onClick}
            src={backCarrot} className="h-[42px] absolute bg-black p-[5px] rounded-[7px] ml-[5px]">
        </input>
    );
}

const NavBarTitle = (props) => {
    return (
        <div className="mx-auto mt-[7px] text-black font-sans font-bold text-[25px]">
            {props.children}
        </div>
    );
}

const NavBar = (props) => {

    return createPortal(
        <div className={"h-[58px] w-[100%] fixed top-[0px] bg-[#ff8f8f] py-[5px] flex justify-between " + props.className}>{props.children}</div>,
        document.body
    );
}

export default NavBar;
export { NavBarTitle, NavBarBackButton };