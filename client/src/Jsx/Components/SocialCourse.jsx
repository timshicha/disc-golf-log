import React, { useEffect, useState } from "react";
import { httpGetUserCourse } from "../../ServerCalls/profile.mjs";
import backArrowImg from "../../assets/images/backArrow.png";
import { isoToVisualFormat } from "../../Utilities/dates.js";
import ObjectTools from "../../Utilities/ObjectTools.js";
import LoadingImg from "../Components/LoadingImg.jsx";
import { compareDates } from "../../Utilities/sorting.js";

const SocialCourseRoundBox = (props) => {
    const value = props.value ? props.value : "\u2013";
    const bg = value < 0 ? "bg-[#d0ffb5]" : value > 0 ? "bg-[#ffb8b8]" : "bg-[#eeeeee]";

    return (
        <div className={"inline-block text-[15px] w-[10%] text-center m-[0.5%] py-[2px] text-black " + bg}>
            {value > 0 ? "+" : ""}{value}
        </div>
    );
}

const SocialCourseRound = (props) => {

    const total = ObjectTools.getRoundTotal(props.round);
    const totalColorBg = total < 0 ? "bg-[green]" : total > 0 ? "bg-[red]" : "bg-gray-subtle";

    return (
        <div className="mt-[25px]">
            <div className="block w-[100%] mb-[3px]">
                <div className={"w-[40px] text-white text-center inline-block mr-[5px] " + totalColorBg}>{total > 0 ? "+" : ""}{total}</div>
                <div className="inline">Round {props.index + 1}</div>
                <div className="float-right mr-[10px]">{isoToVisualFormat(props.round.date)}</div>
            </div>
            <>
            {props.round.score.map(value => {
                return (
                    <SocialCourseRoundBox value={value}>

                    </SocialCourseRoundBox>
                )
            })}
            </>
        </div>
    );
}

const SocialCourse = (props) => {

    const [rounds, setRounds] = useState([]);
    const [roundsErrorMessage, setRoundsErrorMessage] = useState(null);
    const [roundsLoading, setRoundsLoading] = useState(true);

    // Try to load the rounds
    useEffect(() => {
        setRoundsLoading(true);
        httpGetUserCourse(props.username, props.course.courseuuid).then(result => {
            const profileRounds = result.data.rounds;
            setRounds(profileRounds);
            if(!profileRounds || profileRounds.length === 0) {
                setRoundsErrorMessage("No rounds played on this course.");
            }
            else {
                setRoundsErrorMessage(null);
            }
        }).catch(error => {
            console.log(error);
            setRoundsErrorMessage("Could not load rounds.");
        }).finally(() => {
            setRoundsLoading(false);
        })
        // Get the rounds of a user
    }, []);

    return (
        <div>
            <div>
                <hr className="mb-[10px]"></hr>
                <button className="bg-gray-dark rounded-[7px] border-none h-[35px] align-middle cursor-pointer" onClick={props.onBack}>
                    <img src={backArrowImg} className="w-[25px] h-[25px] mx-[8px]"></img>
                </button>
                <div className="inline-block align-middle ml-[8px] text-[20px] text-gray-dark w-[calc(100%-60px)] truncate">{props.course.name}</div>
            </div>
            {!roundsLoading &&
            <>
                {rounds.sort((a, b) => compareDates(a.date, b.date)).map((round, index) => {
                    return <SocialCourseRound key={index} index={index} round={round}></SocialCourseRound>
                }).reverse()}
                {roundsErrorMessage &&
                <div className="text-center mt-[20px] mb-[20px]">
                    {roundsErrorMessage}
                </div>}
            </>
            }
            {roundsLoading &&
                <LoadingImg className="w-[40px] mx-auto my-[20px]"></LoadingImg>
            }
        </div>
    )
};

export default SocialCourse;