import { useState } from "react";
import syncIcon from "../../assets/images/syncIcon.png";
import LoadingImg from "./LoadingImg";

const SyncButton = (props) => {

    const { className, loading, ...otherProps } =  props;

    return (
        <div className={"p-[3px] bg-gray-light text-gray-mild rounded-[5px] font-bold text-[16px] cursor-pointer " + className} {...otherProps}>
            {loading ?
                <LoadingImg className="h-[24px] m-[2px]"></LoadingImg>
            :
                <img src={syncIcon} className="h-[28px]" alt="Sort by"></img>
            }
        </div>
    );
}

export default SyncButton;