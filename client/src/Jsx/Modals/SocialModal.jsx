import React, { useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";

const SocialModal = (props) => {

    const [username, setUsername] = useState(props.username);
    const [searchUsernameString, setSeachUsernameString] = useState("");

    const onSearchUsernameChange = (event) => {
        setSeachUsernameString(event.target.value);
        console.log(event.target.value);
    }

    const onHandleSearchUsername = () => {

    }

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="bg-gray-light w-[95%] mx-auto h-[50px]">
                <div className="w-[fit-content] text-desc text-gray-mild ml-[10px]">{username}</div>
            </div>
            <div className="text-desc text-[12px] text-left ml-[15px] mt-[10px]">Search by username:</div>
            <div className="block">
                <input type="text" onChange={(onSearchUsernameChange)}></input>
                <ModalButton onClick={onHandleSearchUsername} className="bg-blue-basic text-white h-[43px] ml-[6px]">Search</ModalButton>
            </div>
        </LargeModal>
    );
}

export default SocialModal;