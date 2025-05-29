import React, { useEffect, useState, useRef } from "react";
import AddCourseModal from "./Modals/AddCourseModal";
import CourseSlot from "./Components/CourseSlot";
import ModalTitle from "./Modals/ModalComponents/ModalTitle";
import RenameModal from "./Modals/RenameModal";
import { compareDates, compareStrings } from "../js_utils/sorting";
import DataHandler from "../data_handling/data_handler";
import ModifyHolesModal from "./Modals/ModifyHolesModal";
import { Modals } from "../js_utils/Enums";
import CourseOptionsModal from "./Modals/CourseOptionsModal";
import StickyDiv from "./Components/StickyDiv";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import SearchBar from "./Components/SearchBar";
import SortCoursesDropdown from "./Components/SortCoursesDropdown";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

function MainPage (props) {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentModal, setCurrentModal] = useState(null);
    const [searchString, setSearchString] = useState("");
    let sortCourseBy = localStorage.getItem("sort-courses-by") || "Alphabetically";

    const renameModalRef = useRef(null);

    // Reload (load) on initial render
    useEffect(() => {
        // When starting up the app, calculate each course's round counts.
        // *** A better fix for this may be needed because brute forcing every
        // time may take up resources especially when the user has a lot of
        // rounds in many different courses.
        DataHandler.updateCourseRoundCounts().then(() => {
            reloadCourses();
        });
    }, []);

    const reloadCourses = () => {
        DataHandler.getAllCourses().then(result => {
            // If sort alphabetically
            if(sortCourseBy === "Alphabetically") {
                result = result.sort((a, b) => compareStrings(a.name, b.name));
            }
            else if(sortCourseBy === "Recently modified") {
                result = result.sort((a, b) => compareDates(b.modified, a.modified));
            }
            else if(sortCourseBy === "Most played") {
                // Update round counts
                result = result.sort((a, b) => compareStrings(b.roundCount, a.roundCount));
            }
            setCourses(result);
        });
    }

    const handleRenameCourse = (event) => {
        event.preventDefault();
        const newName = event.target.name.value;
        currentCourse.name = newName;
        DataHandler.modifyCourse(currentCourse, true).then(() => {
            setCurrentModal(null);
            setCurrentCourse(null);
            // Reload courses (order of courses may need to change)
            reloadCourses();
        }).catch(error => {
            console.log(error);
        });
    }

    const onSortByChange = (sortBy) => {
        sortCourseBy = sortBy;
        localStorage.setItem("sort-courses-by", sortBy);
        reloadCourses();
    }

    return (
        <div className="p-[10px] height-[calc(100dvh-120px] overflow-scroll">

            {currentModal === Modals.RENAME &&
                // If the user clicks the X, bring them back to course options
                <RenameModal onSubmit={handleRenameCourse} onClose={() => setCurrentModal(Modals.COURSE_OPTIONS)} defaultValue={currentCourse.name} ref={renameModalRef}>
                    <ModalTitle>Rename</ModalTitle>
                </RenameModal>
            }

            {currentModal === Modals.COURSE_OPTIONS &&
                <CourseOptionsModal
                    setModal={setCurrentModal}
                    course={currentCourse}
                    deleteCourseCallback={reloadCourses}>    
                </CourseOptionsModal>
            }

            {currentModal === Modals.HOLE_LABELS &&
                // If the user clicks the X, bring them back to course options.
                // If the onClose happened because the user submitted, close all modals
                <ModifyHolesModal course={currentCourse} onClose={submitted => submitted ? setCurrentModal(null) : setCurrentModal(Modals.COURSE_OPTIONS)}>
                </ModifyHolesModal>
            }
            
            {courses.length > 0
            ? // If there are courses, show courses
            <div className="min-h-[100dvh]">
                <div className="w-full h-[50px]">
                    <SortCoursesDropdown onSubmit={onSortByChange} selected={sortCourseBy} className="inline-block float-left"></SortCoursesDropdown>
                    <SearchBar className="inline-block float-right" onChange={setSearchString}></SearchBar>
                </div>

                    {courses.filter(course => course.name.toLowerCase().includes(searchString.toLowerCase())).map(course => {
                        return (
                            <CourseSlot course={course}
                                key={course.courseUUID}
                                onClick={() => {
                                    // If the user selects a course, tell App.jsx
                                    // to navigate to the Course Page and notify which
                                    // course was selected.
                                    props.setCurrentCourse(course);
                                    props.navigateTo("course");
                                }}
                                onOpenOptionsList = {() => {
                                    setCurrentCourse(course);
                                    setCurrentModal(Modals.COURSE_OPTIONS);
                                }}>
                            </CourseSlot>
                        );
                    })}
                    <div className="h-[200px]"></div>
                </div>
            :   // If there are 0 courses, show a message saying there
                // are no courses
                <p style={{
                    "textAlign": "center",
                    "color": "gray",
                    "margin": "25px"
                }}>You don't have any courses.</p>
            }
            <StickyDiv className="text-center">
                <ModalButton onClick={() => setCurrentModal(Modals.ADD_COURSE)} className="bg-blue-basic text-white">Add course</ModalButton>
            </StickyDiv>
            {currentModal === Modals.ADD_COURSE &&
                <AddCourseModal onClose={() => setCurrentModal(null)} callback={reloadCourses} className="add-course-modal"></AddCourseModal>
            }
        </div>
    );
}

export default MainPage;