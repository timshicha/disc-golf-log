import React from "react";
import TripleDotButton from "../Components/TripleDotButton";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import DataHandler from "../../DataHandling/DataHandler";

class CourseSlot extends React.Component{
    constructor (props) {
        super();

        this.onClick = props.onClick;

        this.state = {
            course: props.course,
            refreshCounter: 0
        };

        this.props = props;
        this.onOpenOptionsList = props.onOpenOptionsList;
        this.onPinCourseCallback = props.onPinCourse;
        this.onUnpinCourseCallback = props.onUnpinCourse;
    }

    onPinCourse = (e) => {
        e.stopPropagation();
        this.state.course.data.pinned = true;
        DataHandler.modifyCourse(this.state.course);
        this.setState({ refreshCounter: this.state.refreshCounter + 1 });
        if(this.onPinCourseCallback) {
            this.onPinCourseCallback(this.state.course);
        }
    }

    onUnpinCourse = (e) => {
        e.stopPropagation();
        this.state.course.data.pinned = false;
        this.setState({ refreshCounter: this.state.refreshCounter + 1 });
        DataHandler.modifyCourse(this.state.course);
        if(this.onUnpinCourseCallback) {
            this.onUnpinCourseCallback(this.state.course);
        }
    }

    render = () => {
        return (
            <div onClick={this.onClick} className="w-[calc(100%-20px] bg-gray-light py-[5px] px-[10px] pr-[0px] mx-auto my-[10px] rounded-[7px] cursor-pointer">
                {/* Course settings button (triple dot icon) */}
                <TripleDotButton className="h-[20px] float-right cursor-pointer rounded-[10px] mt-[8px] mr-[8px] pl-[15px]" onClick={e => {
                    e.stopPropagation();
                    this.onOpenOptionsList();
                }}></TripleDotButton>
                <div className="max-w-[calc(100%-45px)]">
                    <div className="inline-block align-middle cursor-pointer">
                        {this.state.course.data.pinned ?
                            <FaStar size={20} className="text-yellow-500" onClick={this.onUnpinCourse}></FaStar>
                            :
                            <FaRegStar size={20} className="text-gray-subtle" onClick={this.onPinCourse}></FaRegStar>
                        }
                    </div>
                    <div className="inline-block max-w-[calc(100%-45px)] align-middle ml-[10px]">
                        {/* Course title */}
                        <div className="text-[16px] h-[25px] font-bold text-sans truncate">
                            {this.state.course.name}
                        </div>
                        {/* Number of times played text */}
                        <div className="text-[11px] mt-[-3px]">
                            {this.props.course.roundCount === 1
                            ?
                            <>Played 1 time</>
                            :
                            <>Played {this.props.course.roundCount} times</>
                        }
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

export default CourseSlot;