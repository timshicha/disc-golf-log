import React from "react";
import "../../../css/general.css";

const Backdrop = (props) => {

    return (
        <div className="inset-0 bg-gray-dark opacity-[0.9] fixed x-index-[999]" {...props}></div>
    );
}

export default Backdrop;