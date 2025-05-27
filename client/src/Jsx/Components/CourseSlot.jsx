import React from "react";
import TripleDotButton from "../Components/TripleDotButton";

class CourseSlot extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;

        this.state = {
            course: props.course
        };

        this.props = props;
        this.onOpenOptionsList = props.onOpenOptionsList;
    }

    render = () => {
        return (
            <div onClick={this.onClick} className="w-[calc(100%-20px] bg-gray-light p-[10px] pr-[0px] mx-auto my-[10px] rounded-[7px] cursor-pointer">
                {/* Course settings button (triple dot icon) */}
                <TripleDotButton className="h-[20px] float-right cursor-pointer rounded-[10px] mt-[8px]" onClick={e => {
                    e.stopPropagation();
                    this.onOpenOptionsList();
                }}></TripleDotButton>
                {/* Course title */}
                <div className="text-[18px] font-bold text-sans h-[18px]">
                    {this.state.course.name}
                </div>
                {/* Number of holes text */}
                <div className="text-[12px]">
                    {this.props.course.roundCount === 1
                    ?
                    <>Played 1 time</>
                    :
                    <>Played {this.props.course.roundCount} times</>
                    }
                </div>
            </div>
        );
    }
}

export default CourseSlot;