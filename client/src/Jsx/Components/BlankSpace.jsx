import React, { useEffect, useRef } from "react";

const BlankSpace = (props) => {

    const blankSpaceRef = useRef();

    useEffect(() => {
        if(blankSpaceRef.current) {
            blankSpaceRef.current.style.height = props.height; //props.height;
        }
    }, [props.height]);

    return (
        <div ref={blankSpaceRef}></div>
    );
}

export default BlankSpace;