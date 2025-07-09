import React, { useEffect, useState } from "react";
import { httpGetUserCourse } from "../../ServerCalls/profile.mjs";
import backArrowImg from "../../assets/images/backArrow.png";
import { isoToVisualFormat } from "../../Utilities/dates.js";

const SocialCourseRoundBox = (props) => {
    const value = props.value ? props.value : 0;
    const bg = value < 0 ? "bg-[green]" : value > 0 ? "bg-[red]" : "bg-gray-subtle";

    return (
        <div className={"inline-block text-[13px] w-[10%] text-center text-white m-[0.5%] py-[2px] " + bg}>
            {value}
        </div>
    );
}

const SocialCourseRound = (props) => {

    return (
        <div className="mt-[10px]">
            <div className="block w-[100%]">
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
                <button className="bg-gray-dark rounded-[7px] border-none h-[35px] align-middle" onClick={props.onBack}>
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