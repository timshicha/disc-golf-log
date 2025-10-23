import { useState } from "react";
import syncIcon from "../../assets/images/syncIcon.png";

const SyncButton = (props) => {

    const { className, ...otherProps } =  props;

    return (
        <div className={"p-[3px] bg-gray-light text-gray-mild rounded-[5px] font-bold text-[16px] " + className} {...otherProps}>
            <img src={syncIcon} className="h-[28px]" alt="Sort by"></img>
        </div>
    );
}

export default SyncButton;