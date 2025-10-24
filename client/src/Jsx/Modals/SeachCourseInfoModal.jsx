import { useState } from "react";
import LargeModal from "./Frames/LargeModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import { httpLookupCourseInfoByUUID, httpLookupCoursesInfoByPartialName } from "../../ServerCalls/courseInfo.mjs";


const SearchCourseInfoModal = (props) => {

    const [searchString, setSearchString] = useState("");
    const [courseResults, setCourseResults] = useState([]);
    

    const search = async (event) => {
        event.stopPropagation();
        event.preventDefault();

        const result = await httpLookupCoursesInfoByPartialName(searchString);
        console.log(result);
        setCourseResults(result.data);
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

                {/* RESULTS */}
                {courseResults.map((courseResult, index) => {
                    return (
                        <div className="text-[15px] text-left hover:opacity-[0.5] cursor-pointer mt-[2px] py-[4px] px-[15px] bg-gray-light" key={index}>
                            <div className="">
                                {courseResult.name}
                            </div>
                            <div className="text-[12px] text-gray-normal">
                                {courseResult.city}
                            </div>
                        </div>
                    );
                })}

            </LargeModal>
        </>
    );
}

export default SearchCourseInfoModal;