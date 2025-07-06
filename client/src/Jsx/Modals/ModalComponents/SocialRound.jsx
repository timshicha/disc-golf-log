import React, { useEffect } from "react";

const SocialRound = (props) => {

    let total = 0;
    for (let i = 0; i < props.round.score.length; i++) {
        if(props.round.score[i]) {
            total += parseInt(props.round.score[i]);
        }
    }

    return (
        <div {...props} className={"block " + props.className}>
        {
            "total: " + total
        }
        </div>
    );
}

export default SocialRound;