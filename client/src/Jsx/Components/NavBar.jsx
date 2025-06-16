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
        <div className={"absolute ml-[50%] translate-x-[-50%] mt-[5px] text-black font-sans font-bold text-[25px]"}>
            {props.children}
        </div>
    );
}

const NavBar = (props) => {

    return createPortal(
        <div className={"h-[54px] w-[100%] fixed top-[0px] bg-[#baceff] py-[6px] flex justify-between " + props.className}>{props.children}</div>,
        document.body
    );
}

export default NavBar;
export { NavBarTitle, NavBarBackButton };