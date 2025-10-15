import React, { useEffect, useState, useRef, forwardRef, useImperativeHandle } from "react";
import AddCourseModal from "../Jsx/Modals/AddCourseModal";
import CourseSlot from "../Jsx/Components/CourseSlot";
import ModalTitle from "../Jsx/Modals/ModalComponents/ModalTitle";
import RenameModal from "../Jsx/Modals/RenameModal";
import { compareDates, compareStrings } from "../Utilities/sorting";
import DataHandler from "../DataHandling/DataHandler";
import ModifyHolesModal from "../Jsx/Modals/ModifyHolesModal";
import { Modals, Pages } from "../Utilities/Enums";
import CourseOptionsModal from "../Jsx/Modals/CourseOptionsModal";
import StickyDiv from "../Jsx/Components/StickyDiv";
import ModalButton from "../Jsx/Modals/ModalComponents/ModalButton";
import SearchBar from "../Jsx/Components/SearchBar";
import SortCoursesDropdown from "../Jsx/Components/SortCoursesDropdown";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

const MainPage = forwardRef((props, ref) => {
    const [courses, setCourses] = useState([]);
    // Separate pinned and unpinned courses
    const [pinnedCourses, setPinnedCourses] = useState([]);
    const [unpinnedCourses, setUnpinnedCourses] = useState([]);
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

    useImperativeHandle(ref, () => ({
        reloadCourses: reloadCourses
    }));

    const reloadCourses = () => {
        DataHandler.getAllCourses().then(result => {
            // Separate courses into pinned and unpinned
            let pinnedCourses = result.filter(course => course.data.pinned);
            let unpinnedCourses = result.filter(course => !course.data.pinned);
            // If sort alphabetically
            if(sortCourseBy === "Alphabetically") {
                pinnedCourses = pinnedCourses.sort((a, b) => compareStrings(a.name.toUpperCase(), b.name.toUpperCase()));
                unpinnedCourses = unpinnedCourses.sort((a, b) => compareStrings(a.name.toUpperCase(), b.name.toUpperCase()));
            }
            else if(sortCourseBy === "Recently modified") {
                pinnedCourses = pinnedCourses.sort((a, b) => compareDates(b.modified, a.modified));
                unpinnedCourses = unpinnedCourses.sort((a, b) => compareDates(b.modified, a.modified));
            }
            else if(sortCourseBy === "Most played") {
                // Update round counts
                pinnedCourses = pinnedCourses.sort((a, b) => compareStrings(b.roundCount, a.roundCount));
                unpinnedCourses = unpinnedCourses.sort((a, b) => compareStrings(b.roundCount, a.roundCount));
            }
            setCourses(result);
            setPinnedCourses(pinnedCourses);
            setUnpinnedCourses(unpinnedCourses);
        });
    }

    const handleRenameCourse = (event) => {
        event.preventDefault();
        event.stopPropagation();
        currentCourse.name = event.target.inputValue;
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

    const addCourseCallback = (course) => {
        setCurrentCourse(course);
        props.setCurrentCourse(course);
        // See if user's setting is to auto-open course on creation
        if(localStorage.getItem("auto-open-course-on-creation") === "true") {
            props.navigateTo(Pages.COURSE);
        }
        // Otherwise reload courses so new one appears
        else {
            reloadCourses();
        }
    }

    return (
        <div className="p-[10px] height-[100dvh]] overflow-hidden">

            {currentModal === Modals.RENAME &&
                // If the user clicks the X, bring them back to course options
                <RenameModal replaceImg="back-arrow" onSubmit={handleRenameCourse}
                    onClose={() => setCurrentModal(null)}
                    onBack={() => setCurrentModal(Modals.COURSE_OPTIONS)}
                    defaultValue={currentCourse.name} ref={renameModalRef}>
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
                <ModifyHolesModal replaceImg="back-arrow"course={currentCourse}
                    onClose={() => setCurrentModal(null)}
                    onBack={() => setCurrentModal(Modals.COURSE_OPTIONS)}>
                </ModifyHolesModal>
            }
            
            {courses.length > 0
            ? // If there are courses, show courses
            <div className="fixed left-0 w-[100dvw] overflow-hidden">
                <div className="fixed left-0 bg-white w-full h-[45px] p-[10px]">
                    <SortCoursesDropdown onSubmit={onSortByChange} selected={sortCourseBy} className="inline-block float-left"></SortCoursesDropdown>
                    <SearchBar id="course-search-bar" className="inline-block float-right" onChange={setSearchString}></SearchBar>
                </div>
                <div className="fixed left-0 mt-[45px] w-[100%] h-[5px] bg-linear-to-b to-[#ffffff00] from-[#ffffff]"></div>
                
                <div className="h-[46px]"></div>
                <div className="h-[calc(100dvh-120px)] overflow-scroll px-[10px]">
                    {/* If there are pinned courses, add a section for pinned courses */}
                    {pinnedCourses.length > 0 &&  
                        <>
                            <div className="text-[12px] text-gray-subtle font-bold text-sans text-center mb-[2px]">Pinned Courses</div>
                            {/* Filter by search string. If name is undefined, treat as empty string. */}
                            {pinnedCourses.filter(course => (course.name ? course.name : "" ).toLowerCase().includes(searchString.toLowerCase())).map(course => {
                                return (
                                    <CourseSlot course={course}
                                        key={course.courseUUID}
                                        className="mb-[8px]"
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
                                        }}
                                        onReloadCourses={reloadCourses}>
                                    </CourseSlot>
                                );
                            })}
                            <hr className="text-gray-subtle border-[1px] mb-[8px]"></hr>
                        </>
                    }
                    {/* Filter by search string. If name is undefined, treat as empty string. */}
                    {unpinnedCourses.filter(course => (course.name ? course.name : "" ).toLowerCase().includes(searchString.toLowerCase())).map(course => {
                        return (
                            <CourseSlot course={course}
                                key={course.courseUUID}
                                className="mt-[8px]"
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
                                }}
                                onReloadCourses={reloadCourses}>
                            </CourseSlot>
                        );
                    })}
                    <div className="h-[60px]"></div>
                </div>
                </div>
            :   // If there are 0 courses, show a message saying there
                // are no courses
                <p className="text-center text-desc mt-[25px] w-[100dvw]">
                    You don't have any courses.
                </p>
            }
            <StickyDiv className="text-center">
                <ModalButton onClick={() => setCurrentModal(Modals.ADD_COURSE)} className="bg-blue-basic text-white">Add course</ModalButton>
            </StickyDiv>
            {currentModal === Modals.ADD_COURSE &&
                <AddCourseModal onClose={() => setCurrentModal(null)} callback={addCourseCallback} className="add-course-modal"></AddCourseModal>
            }
        </div>
    );
});

export default MainPage;