import React from "react";
import "../../css/stickyDiv.css";

// In some pages we need a button to stay at the bottom of the screen,
// like "Add Round" button regardless of where the user has scrolled.
const StickyDiv = (props) => {

    return (
        <div className="sticky-div">
            {/* The gradient makes it so the top part of the screen isn't
            cut off suddenly. */}
            <div className="sticky-div-gradient"></div>
            <div className="sticky-div-bg white-background">
                {props.children}
            </div>
        </div>
    );
}

export default StickyDiv;