import React, { useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";

const SocialModal = (props) => {

    const [username, setUsername] = useState(props.username);
    const [searchUsernameString, setSeachUsernameString] = useState("");
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);

    const onSearchUsernameChange = (event) => {
        setSeachUsernameString(event.target.value);
        console.log(event.target.value);
    }

    const onHandleSearchUsername = () => {

    }

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="bg-gray-light w-[95%] mx-auto py-[5px]">
                <div className="text-left">
                    <div className="text-desc text-gray-mild ml-[10px]">{username}</div>
                    <div className="text-desc text-[12px] text-gray-subtle ml-[10px]">Played {coursesPlayed} courses.</div>
                    <div className="text-desc text-[12px] text-gray-subtle ml-[10px]">Played {roundsPlayed} rounds.</div>
                </div>
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