import React from "react";

// In some pages we need a button to stay at the bottom of the screen,
// like "Add Round" button regardless of where the user has scrolled.
const StickyDiv = (props) => {

    return (
        <div className={"fixed w-full bottom-[0px] " + props.className}>
            {/* The gradient makes it so the top part of the screen isn't
            cut off suddenly. */}
            <div className="w-[100%] h-[20px] bg-linear-to-b from-[#ffffff00] to-[#ffffff]"></div>
            <div className="py-[10px] bg-white">
                {props.children}
            </div>
        </div>
    );
}

export default StickyDiv;