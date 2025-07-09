import React, { useEffect, useState } from "react";
import { httpGetUserCourse } from "../../ServerCalls/profile.mjs";
import backArrowImg from "../../assets/images/backArrow.png";
import { isoToVisualFormat } from "../../Utilities/dates.js";
import ObjectTools from "../../Utilities/ObjectTools.js";

const SocialCourseRoundBox = (props) => {
    const value = props.value ? props.value : "\u2013";
    const bg = value < 0 ? "bg-[#d0ffb5]" : value > 0 ? "bg-[#ffd2d2]" : "bg-[#eeeeee]";

    return (
        <div className={"inline-block text-[18px] w-[10%] text-center text-gray-mild m-[0.5%] py-[2px] " + bg}>
            {value}
        </div>
    );
}

const SocialCourseRound = (props) => {

    const total = ObjectTools.getRoundTotal(props.round);
    const totalColorBg = total < 0 ? "bg-[green]" : total > 0 ? "bg-[red]" : "bg-gray-subtle";

    return (
        <div className="mt-[25px]">
            <div className="block w-[100%] mb-[3px]">
                <div className={"w-[30px] text-white text-center inline-block mr-[5px] " + totalColorBg}>{total}</div>
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

    // Try to load the rounds
    useEffect(() => {
        httpGetUserCourse(props.username, props.course.courseuuid).then(result => {
            console.log(result);
            setRounds(result.data.rounds);
        }).catch(error => {
            console.log(error);
        });
        // Get the rounds of a user
    }, []);

    return (
        <div>
            <div>
                <button className="bg-gray-dark rounded-[7px] border-none h-[35px] align-middle cursor-pointer" onClick={props.onBack}>
                    <img src={backArrowImg} className="w-[25px] h-[25px] mx-[8px]"></img>
                </button>
                <div className="inline-block align-middle ml-[8px] text-[20px] text-gray-dark w-[calc(100%-60px)] truncate">{props.course.name}</div>
            </div>
            {rounds.map((round, index) => {
                return <SocialCourseRound key={index} index={index} round={round}></SocialCourseRound>
            }).reverse()}
        </div>
    )
};

export default SocialCourse;