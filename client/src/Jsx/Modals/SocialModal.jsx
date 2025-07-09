import React, { useCallback, useEffect, useRef, useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import { httpGetUserProfile } from "../../ServerCalls/profile.mjs";
import SocialRound from "../Components/SocialRound";
import SocialCourseSlot from "../Components/SocialCourseSlot";
import SocialCourse from "../Components/SocialCourse";
import { compareStrings } from "../../Utilities/sorting.js";
import LoadingImg from "../Components/LoadingImg.jsx";

const SocialModal = (props) => {

    const [username, setUsername] = useState("");
    const searchUsernameRef = useRef(null);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [recentRoundsList, setRecentRoundsList] = useState([]);
    const [privateProfile, setPrivateProfile] = useState(false);
    const [error, setError] = useState(null);
    const [courseSelected, setCourseSelected] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);

    const loadProfile = async (username) => {
        setProfileLoading(true);
        console.log(username);
        const result = await httpGetUserProfile(username);
        // If successfully retrieved profile, display it
        if(result?.success) {
            console.log(result);
            setError(false);
            setUsername(result.data.username);
            // If profile is visible
            if(result?.data?.visible) {
                setPrivateProfile(false);
                setCourseList(result.data.courses);
                setRecentRoundsList(result.data.rounds);
                setCoursesPlayed(result.data.courses.length);
                setRoundsPlayed(result.data.roundCount);
            }
            else {
                setPrivateProfile(true);
                setCourseList([]);
                setCoursesPlayed(0);
            }
        }
        // If error
        else {
            if(result?.status === 404) {
                setError("User not found.");
            }
            else {
                setError("Could not connect to server.");
            }
            setPrivateProfile(false);
        }
        setProfileLoading(false);
    }

    useEffect(() => {
        if(props.username) {
            setUsername(props.username);
            loadProfile(props.username);
        }
    }, []);

    const onHandleSearchUsername = () => {
        setCourseSelected(null);
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
            {!profileLoading &&
            <div className="bg-gray-light max-h-[calc(100%-130px)] mx-auto text-left p-[10px] text-desc overflow-x-hidden">
                {!error && username &&
                <>
                    <div className="text-gray-dark text-[16px] mb-[5px] inline-block bg-gray-dark text-white py-[3px] px-[8px]">{username}</div>
                    {privateProfile === true &&
                        <div className="text-desc text-center">This user's profile is private.{console.log("ok")}</div>
                    }
                    {!privateProfile && !courseSelected &&
                    <>
                        <div className="text-[14px] text-gray-medium w-[90%] mx-auto">
                            <div className="w-[50%] inline-block">
                                Courses: {coursesPlayed}
                            </div>
                            <div className="w-[50%] inline-block">
                                Rounds: {roundsPlayed}
                            </div>
                        </div>
                        <hr className="my-[5px]"/>
                        <div className="text-gray-dark">Recent rounds:</div>
                        <div className="ml-[5px] text-gray-subtle">
                            {recentRoundsList.map((round, index) => {
                                return (
                                    <SocialRound round={round} key={index}></SocialRound>
                                );
                            })}
                        </div>
                        <hr className="my-[5px]" />
                        <div className="text-gray-dark">Courses:</div>
                        {(courseList && courseList.length > 0) ?
                            courseList.sort((a, b) => compareStrings(a.name, b.name)).map((course, index) => {return (
                                <SocialCourseSlot course={course} key={index} onClick={() => setCourseSelected(course)}></SocialCourseSlot>
                            )})
                            :
                            <div className="text-gray-subtle text-center">This player does not have any courses.</div>
                        }
                        <hr className="my-[5px]" />
                        <div className="text-gray-dark">Friends:</div>
                        <div className="ml-[5px] text-gray-subtle">Coming soon</div>
                    </>
                    }
                    {courseSelected &&
                    <SocialCourse course={courseSelected} username={username} onBack={() => {
                        setCourseSelected(null);
                    }}>

                    </SocialCourse>
                    }
                </>}
                {error &&
                <div className="text-desc text-center">{error}</div>}
            </div>
            }
            {profileLoading &&
            <LoadingImg className="w-[40px] mx-auto mt-[30px]"></LoadingImg>
            }
        </LargeModal>
    );
}

export default SocialModal;