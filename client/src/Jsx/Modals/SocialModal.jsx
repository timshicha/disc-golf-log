import React, { useCallback, useEffect, useRef, useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import { httpGetUserProfile } from "../../ServerCalls/profile.mjs";

const SocialModal = (props) => {

    const [username, setUsername] = useState("");
    const searchUsernameRef = useRef(null);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [courseList, setCourseList] = useState([]);


    const loadProfile = async (username) => {
        console.log(username);
        const result = await httpGetUserProfile(username);
        // If successfully retrieved profile, display it
        if(result.success) {
            setUsername(result.data.username);
            setCourseList(result.data.courses);
            setCoursesPlayed(result.data.courses.length);
        }
    }

    useEffect(() => {
        setUsername(props.username);
        loadProfile(props.username);
    }, []);

    const onHandleSearchUsername = () => {
        loadProfile(searchUsernameRef.current.value);
    }

    return (
        <LargeModal {...props}>
            <ModalTitle>Social</ModalTitle>
            <div className="text-desc text-[12px] text-left mt-[10px]">Search user by username:</div>
            <div className="block text-left mb-[10px]">
                <input type="text" className="w-[calc(100%-90px)]" ref={searchUsernameRef} name="username"></input>
                <ModalButton onClick={() => onHandleSearchUsername()} className="bg-blue-basic text-white h-[43px] ml-[6px]">Search</ModalButton>
            </div>
            <div className="bg-gray-light max-h-[calc(100%-130px)] mx-auto text-left p-[10px] text-desc overflow-scroll">
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
                    courseList.map((course, index) => {return (
                        <div className="ml-[5px] text-gray-medium" key={index}>- {course}</div>
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