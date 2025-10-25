import { useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import { httpLookupCourseInfoByUUID, httpLookupCoursesInfoByPartialName } from "../../ServerCalls/courseInfo.mjs";


const SearchCourseInfoModal = (props) => {

    const [searchString, setSearchString] = useState("");
    const [courseResults, setCourseResults] = useState([]);
    const [courseInfo, setCourseInfo] = useState(null);
    

    const search = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        // If searching for a new course, un-display the old course info so we can display
        // a list of search results of new courses
        setCourseInfo(null)
        const result = await httpLookupCoursesInfoByPartialName(searchString);
        console.log(result.data);
        setCourseResults(result.data);
    }

    const onOpenCourse = async (uuid) => {
        const result = await httpLookupCourseInfoByUUID(uuid);
        if(result.success) {
            setCourseInfo(result.data);
        }
    }

    return (
        <>
            <LargeModal onClose={props.onClose}>
                <ModalTitle>Course Lookup</ModalTitle>
                <div className="text-[12px] text-gray-dark mb-[10px]">Search for disc golf courses by name.</div>

                {/* SEARCH BAR AREA */}
                <form onSubmit={search} className="mb-[5px]">
                    <div className="flex items-center">
                        <input value={searchString} onChange={(event) => {
                                setSearchString(event.target.value)
                            }}
                            className="flex-grow min-w-0"
                            autoComplete="off" placeholder="Course name">    
                        </input>
                        <ModalButton className="bg-blue-basic text-white ml-[10px] w-auto" type="submit">Search</ModalButton>

                    </div>
                </form>

                <div className="overflow-y-auto max-h-[calc(100%-120px)]">
                    {/* IF NOT SHOWING A COURSE, SHOW SEARCH RESULTS */}
                    {!courseInfo &&
                        <>
                        {/* RESULTS */}
                        {courseResults.map((courseResult, index) => {
                            return (
                                <div className="text-[15px] text-left hover:opacity-[0.5] cursor-pointer mt-[2px] py-[4px] px-[15px] bg-gray-light" key={index}
                                    onClick={() => onOpenCourse(courseResult.uuid)}>
                                    <div className="">
                                        {courseResult.name}
                                    </div>
                                    <div className="text-[12px] text-gray-normal">
                                        {courseResult.city}
                                    </div>
                                </div>
                            );
                        })}
                        </>
                    }
                    {/* IF SHOWING A COURSE */}
                    {courseInfo &&
                        <>
                        {/* COURSE INFO */}
                        <div className="bg-gray-light p-[10px]">
                            <div>{courseInfo.name}</div>
                            <div className="text-[12px] text-gray-normal">{courseInfo.city}</div>
                            <div className="text-left text-[15px] text-gray-dark mt-[10px]">
                                Course scoresheet:
                            </div>
                            <div className="grid grid-cols-9 gap-[3px] mb-[10px]">
                                {courseInfo.data.holes.map((_, index) => {
                                    return (
                                        <div className="bg-white py-[3px] px-[3px]" key={index}>
                                            <div className="block text-[10px] text-left text-gray-subtle leading-[8px]">
                                                {courseInfo.data.holeLabels[index]}
                                            </div>
                                            <div className="block text-[20px] leading-[20px]">
                                                {courseInfo.data.holes[index]}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="text-left text-[15px] text-gray-dark mt-[10px]">
                                Course map:
                            </div>
                            {/* Course images */}
                            {courseInfo.data.images?.map((image, index) => {
                                return (
                                    <div className="" key={index}>
                                        <img src={image.url} className="w-[100%] border-[2px] border-gray-subtle"></img>
                                        <div className="text-white text-left text-[12px] bg-gray-mild px-[10px] py-[3px]">
                                            {image.info}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        </>
                    }
                </div>

            </LargeModal>
        </>
    );
}

export default SearchCourseInfoModal;