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
import { FriendStatus } from "../../Utilities/Enums.js";
import addFriendIcon from "../../assets/images/addFriendIcon.png";
import greenCheckMark from "../../assets/images/greenCheckMark.png";
import refreshIcon from "../../assets/images/refreshIcon.png";
import checkMark from "../../assets/images/checkMark.png";
import whiteX from "../../assets/images/whiteX.png";
import { httpGetAllFriendRequests, httpGetAllFriends, httpRemoveFriend, httpRespondToFriendRequest, httpSendFriendRequest, httpUndoSendFriendRequest } from "../../ServerCalls/friends.mjs";
import ConfirmModal from "./ConfirmModal.jsx";

const SocialPages = {
    PROFILE: "profile",
    FRIENDS: "friends"
};

const TabButton = (props) => {

    return (
        <button onClick={props.onClick} className={"w-[40%] py-[5px] mx-[5px] mb-[-1px] rounded-t-[10px] " +
            (props.selected === true ? "bg-white" : "bg-gray-normal")
        }>
            {props.children}
        </button>
    );
}

const FriendSlot = (props) => {

    const handleUnfriendClick = (event) => {
        event.stopPropagation();
        props.onUnfriend();
    }

    const handleSelectUserClick = (event) => {
        props.onSelect();
    }

    return (
        <div className="w-[100%] bg-gray-light text-left py-[7px] rounded-[7px] mt-[10px]">
            <div className="text-left inline-block w-[calc(100%-110px)] truncate mx-[5px] text-[20px] ml-[10px] align-middle" onClick={handleSelectUserClick}>
                {props.user.username}
            </div>
            <div className="inline-block">
                <button className="bg-gray-dark text-white text-[18px] p-[3px] px-[6px] rounded-[5px] align-middle" onClick={handleUnfriendClick}>Unfriend</button>
            </div>
        </div>
    );
}

const FriendRequestSlot = (props) => {

    const handleSelectUserClick = (event) => {
        props.onSelect();
    }

    return (
        <div className="relative w-[100%] bg-gray-light text-left py-[7px] rounded-[7px] mt-[10px]">
            <div className="text-left inline-block w-[calc(100%-100px)] truncate mx-[5px] text-[20px] ml-[10px] align-middle" onClick={handleSelectUserClick}>
                {props.user.username}
            </div>
            <div className="absolute right-[8px] inline-block">
                <button className="bg-[green] align-middle p-[5px] rounded-[5px] mr-[5px]" onClick={props.onAccept}><img className="w-[24px]" src={checkMark}></img></button>
                <button className="bg-[red] align-middle p-[5px] rounded-[5px]" onClick={props.onDecline}><img className="w-[24px]" src={whiteX}></img></button>
            </div>
        </div>
    )
}

const SocialModal = (props) => {

    const [currentModal, setCurrentModal] = useState(SocialPages.PROFILE);

    const [username, setUsername] = useState("");
    const [userUUID, setUserUUID] = useState(null);
    const [friends, setFriends] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const searchUsernameRef = useRef(null);
    const [coursesPlayed, setCoursesPlayed] = useState(0);
    const [roundsPlayed, setRoundsPlayed] = useState(0);
    const [courseList, setCourseList] = useState([]);
    const [recentRoundsList, setRecentRoundsList] = useState([]);
    const [friendStatus, setFriendStatus] = useState(null);
    const [privateProfile, setPrivateProfile] = useState(false);
    const [error, setError] = useState(null);
    const [courseSelected, setCourseSelected] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [respondingToFriendRequest, setRespondingToFriendReqeust] = useState(false);
    const [friendsLoading, setFriendsLoading] = useState(false);

    const loadProfile = async (username) => {
        setProfileLoading(true);
        console.log(username);
        const result = await httpGetUserProfile(username);
        // If successfully retrieved profile, display it
        if(result?.success) {
            console.log(result);
            setError(false);
            setUsername(result.data.username);
            setUserUUID(result.data.userUUID);
            // If profile is visible
            if(result.data?.visible) {
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
            // Update friend status
            if(result.data?.friends) {
                setFriendStatus(FriendStatus.FRIENDS);
            }
            else if(result.data?.friends === false) {
                // Check for friend requests sent or received
                if(result.data.friendRequest === "sent") {
                    setFriendStatus(FriendStatus.REQUEST_SENT);
                }
                else if(result.data.friendRequest === "received") {
                    setFriendStatus(FriendStatus.REQUEST_RECEIVED);
                }
                else {
                    setFriendStatus(FriendStatus.NOT_FRIENDS);
                }
            }
            else {
                setFriendStatus(null);
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
            getAllFriends();
        }
    }, []);

    const onHandleSearchUsername = () => {
        setCourseSelected(null);
        loadProfile(searchUsernameRef.current.value);
    }

    const sendFriendRequest = () => {
        setRespondingToFriendReqeust(true);
        httpSendFriendRequest(userUUID).then(res => {

            // If successfully sent request, update UI
            if(res.success) {
                setFriendStatus(FriendStatus.REQUEST_SENT);
            }
        }).finally(() => {
            setRespondingToFriendReqeust(false);
        });
    }

    const undoSendFriendRequest = () => {
        setRespondingToFriendReqeust(true);
        httpUndoSendFriendRequest(userUUID).then(res => {

            // If successfully unsent the request, update UI
            if(res.success) {
                setFriendStatus(FriendStatus.NOT_FRIENDS);
            }
        }).finally(() => {
            setRespondingToFriendReqeust(false);
        });
    }

    const acceptFriendRequest = (acceptUserUUID) => {
        const useruuid = acceptUserUUID ? acceptUserUUID : userUUID;
        setRespondingToFriendReqeust(true);
        httpRespondToFriendRequest(useruuid, "accept").then(res => {

            if(res.success) {
                // If successful, then set the new UI (to friends)
                setFriendStatus(FriendStatus.FRIENDS);
            }
        }).finally(() => {
            setRespondingToFriendReqeust(false);
        });
    }

    const declineFriendRequest = (declineUserUUID) => {
        const useruuid = declineUserUUID ? declineUserUUID : userUUID;
        setRespondingToFriendReqeust(true);
        httpRespondToFriendRequest(useruuid, "decline").then(res => {

            if(res.success) {
                // If successful, then set the new UI (to not friends)
                setFriendStatus(FriendStatus.NOT_FRIENDS);
            }
        }).finally(() => {
            setRespondingToFriendReqeust(false);
        });
    }

    const getAllFriends = async () => {
        setFriendsLoading(true);
        const allFriendsRes = await httpGetAllFriends();
        setFriends(allFriendsRes.data.friends);

        const allFriendRequestsRes = await httpGetAllFriendRequests();
        setFriendRequests(allFriendRequestsRes.data.friendRequests);

        setFriendsLoading(false);
    }

    const onSelectFriend = (friend) => {
        console.log("friend profile selected");
        console.log(friend.useruuid, friend.username);
        setCourseSelected(null);
        setCurrentModal(SocialPages.PROFILE);
        loadProfile(friend.username);
    }

    const unfriend = (friend) => {
        httpRemoveFriend(friend.useruuid).then(result => {
            // On successful unfriending, remove from friend list
            if(result.success) {
                setFriends(friends.filter(iterFriend => iterFriend.useruuid !== friend.useruuid));
            }
        });
    }

    return (
        <LargeModal {...props}>
            {/* <ModalTitle>Social</ModalTitle> */}
            {/* NAV TABS */}
            <div className="text-[15px]">
                <TabButton selected={currentModal === SocialPages.PROFILE} onClick={() => setCurrentModal(SocialPages.PROFILE)}>Profile</TabButton>
                <TabButton selected={currentModal === SocialPages.FRIENDS} onClick={() => setCurrentModal(SocialPages.FRIENDS)}>Friends</TabButton>
            </div>
            {/* END NAV TABS */}
            <div className={"absolute h-[calc(100%-60px)] w-[95%] left-[calc(50%)] translate-x-[-50%] bg-white p-[10px] rounded-[5px] overflow-y-auto " +
                (currentModal !== SocialPages.PROFILE ? "opacity-[0%] pointer-events-none" : "")}>
                <div className="text-desc text-[12px] text-left">Search user by username:</div>
                <div className="block text-left mb-[10px]">
                    <input type="text" className="w-[calc(100%-90px)]" ref={searchUsernameRef} name="username"></input>
                    <ModalButton onClick={() => onHandleSearchUsername()} className="bg-blue-basic text-white h-[43px] ml-[6px]">Search</ModalButton>
                </div>
                {!profileLoading &&
                <div className="bg-gray-light mx-auto text-left p-[10px] text-desc overflow-x-hidden">
                    {!error && username &&
                    <>
                        <div className="text-gray-dark text-[20px] mb-[5px] inline-block bg-gray-dark text-white py-[3px] px-[8px]">{username}</div>
                        {/* Friend request area of profile */}
                        <div className="float-right text-center text-[14px] mb-[20px]">
                        {respondingToFriendRequest ?
                            <div>
                                <LoadingImg className="w-[35px] mr-[20px]"></LoadingImg>
                            </div>
                        : friendStatus === FriendStatus.NOT_FRIENDS ?
                            <div>
                                <div className="mb-[5px] text-gray-dark">Not friends</div>
                                <button className="text-white bg-blue-basic p-[5px] px-[15px] rounded-[7px]" onClick={sendFriendRequest}>
                                    <img src={addFriendIcon} className="h-[10px] my-[7px] mx-auto inline mr-[5px] align-middle" />
                                    <div className="inline align-middle">
                                        Add friend
                                    </div>
                                </button>
                            </div>
                        : friendStatus === FriendStatus.FRIENDS ?
                            <div className="text-[green]">
                                <img src={greenCheckMark} className="h-[18px] mx-[5px] inline align-middle" />
                                <div className="align-middle inline">Friends</div>
                            </div>
                        : friendStatus === FriendStatus.REQUEST_SENT ?
                            <div className="text-gray-dark">
                                <div className="mb-[5px] text-[blue]">Friend request sent</div>
                                <button className="block mx-auto bg-gray-dark text-white text-[16px] p-[3px] px-[10px] rounded-[5px]" onClick={undoSendFriendRequest}>Undo</button>
                            </div>
                        : friendStatus === FriendStatus.REQUEST_RECEIVED ?
                            <div>
                                <div className="mb-[5px] text-[blue]">Friend request received</div>
                                <button className="inline-block mx-auto bg-gray-dark text-white text-[16px] text-center p-[3px] w-[80px] rounded-[5px] mr-[5px]" onClick={acceptFriendRequest}>Accept</button>
                                <button className="inline-block mx-auto bg-gray-dark text-white text-[16px] text-center p-[3px] w-[80px] rounded-[5px]" onClick={declineFriendRequest}>Decline</button>
                            </div>
                        : ""
                        }
                        </div>
                        {/* End of friend request area */}
                        <hr className="w-[100%] my-[5px]"></hr>
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
                <div className="bg-gray-light py-[20px]">
                    <LoadingImg className="w-[40px] mx-auto"></LoadingImg>
                </div>
                }
            </div>

            {/* FRIENDS PAGE */}
            <div className={"absolute h-[calc(100%-60px)] w-[95%] left-[calc(50%)] translate-x-[-50%] bg-white p-[10px] rounded-[5px] overflow-y-auto " +
                (currentModal !== SocialPages.FRIENDS ? "opacity-[0%] pointer-events-none" : "")}>
                <div className="mb-[20px]">
                    {friendsLoading &&
                    <div className="bg-gray-light p-[5px] absolute left-[10px] rounded-[30px]">
                        <LoadingImg className="w-[30px]">
                        </LoadingImg>
                    </div>
                    }
                    <button className="absolute right-[10px] bg-gray-dark p-[2px] rounded-[7px]" onClick={getAllFriends}><img src={refreshIcon} className="w-[30px]"></img></button>
                </div>
                {(friendRequests && friendRequests.length > 0) &&
                <>
                    <div className="text-black text-[15px]">Friend Requests</div>
                    {friendRequests.map((friendRequest, index) => {
                        return <FriendRequestSlot user={friendRequest}
                            onSelect={() => {
                                loadProfile(friendRequest.username);
                                setCurrentModal(SocialPages.PROFILE);
                            }}
                            onAccept={() => {acceptFriendRequest(friendRequest.useruuid)}}
                            onDecline={() => {declineFriendRequest(friendRequest.useruuid)}}
                        ></FriendRequestSlot>
                    })}
                    <hr className="my-[10px]"></hr>
                </>
                }
                <div className="inline-block text-center">Friends</div>
                {friends && friends.length > 0 ? friends.map((friend, index) => {
                    return <FriendSlot key={index} user={friend}
                        onSelect={() => onSelectFriend(friend)}
                        onUnfriend={() => unfriend(friend)}
                    ></FriendSlot>
                    })
                :
                <>
                    <div className="text-desc text-gray-dark my-[20px]">You don't have any friends.</div>
                    <div className="text-center text-gray-subtle text-[13px]">It's  because no one wants to play with someone that always wins.</div>
                </> 
                }
            </div>
        </LargeModal>
    );
}

export default SocialModal;