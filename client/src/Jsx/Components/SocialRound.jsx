import React, { useEffect } from "react";
import { isoToVisualFormat } from "../../Utilities/dates";

const SocialRound = (props) => {

    let total = 0;
    for (let i = 0; i < props.round.score.length; i++) {
        if(props.round.score[i]) {
            total += parseInt(props.round.score[i]);
        }
    }
    let color;
    if(total < 0) {
        color = "bg-[green]";
    }
    else if(total > 0) {
        color = "bg-[red]";
    }
    else {
        color = "bg-black";
    }

    return (
        <div {...props} className={"block w-[100%] mt-[5px] " + props.className}>
            <div className={"w-[30px] h-[25px] text-white text-center inline-block align-middle " + color}>{total > 0 ? "+" : ""}{total}</div>
            <div className="ml-[5px] h-[25px] text-black inline-block align-middle max-w-[calc(100%-170px)] truncate">{props.round.name}</div>
            <div className="float-right w-[130px] text-right">{isoToVisualFormat(props.round.played_at)}</div>
        </div>
    );
}

export default SocialRound;