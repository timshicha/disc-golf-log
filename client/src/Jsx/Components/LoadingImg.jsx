import React from "react";
import loadingImg from "../../assets/images/loading.png";

const LoadingImg = (props) => {
    return (
        <div>
            <img
                className={"animate-rotate8 origin-cetner " + props.className}
                alt="Loading icon"
                src={loadingImg}
            />
        </div>
    )
}

export default LoadingImg;