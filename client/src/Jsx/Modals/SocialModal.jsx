import React, { useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";

const SocialModal = (props) => {

    const [username, setUsername] = useState(props.username);
    const [searchUsernameString, setSeachUsernameString] = useState("");
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [courseList, setCourseList] = useState(["alaska", "bob"]);

    const onSearchUsernameChange = (event) => {
        setSeachUsernameString(event.target.value);
        console.log(event.target.value);
    }

    const onHandleSearchUsername = () => {

    }

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="text-desc text-[12px] text-left mt-[10px]">Search user by username:</div>
            <div className="block text-left mb-[10px]">
                <input type="text" className="w-[calc(100%-90px)]" onChange={(onSearchUsernameChange)}></input>
                <ModalButton onClick={onHandleSearchUsername} className="bg-blue-basic text-white h-[43px] ml-[6px]">Search</ModalButton>
            </div>
            <div className="bg-gray-light mx-auto text-left p-[10px] text-desc">
                <div className="text-gray-dark text-[16px] mb-[5px] inline-block bg-gray-dark text-white py-[3px] px-[8px]">{username}</div>
                <div className="text-[14px] text-gray-medium w-[90%] mx-auto">
                    <div className="w-[50%] inline-block">
                        Courses: {coursesPlayed}
                    </div>
                    <div className="w-[50%] inline-block">
                        Rounds: {roundsPlayed}
                    </div>
                </div>
                <hr className="my-[5px]"/>
                <div className="text-gray-dark">Courses:</div>
                {(courseList && courseList.length > 0) ?
                    courseList.map(course => {return (
                        <div className="ml-[5px] text-gray-medium">- {course}</div>
                    )})
                    :
                    <div className="text-gray-subtle text-center">This player does not have any courses.</div>
                }
                <hr className="my-[5px]" />
                <div className="text-gray-dark">Rounds:</div>
                <div className="ml-[5px] text-gray-subtle">Coming soon</div>
                <hr className="my-[5px]" />
                <div className="text-gray-dark">Friends:</div>
                <div className="ml-[5px] text-gray-subtle">Coming soon</div>
            </div>
        </LargeModal>
    );
}

export default SocialModal;