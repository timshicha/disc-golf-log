import React, { useEffect, useState, useRef } from "react";
import AddCourseModal from "./Modals/AddCourseModal";
import CourseSlot from "./Components/CourseSlot";
import "../css/general.css";
import ModalTitle from "./Modals/ModalComponents/ModalTitle";
import RenameModal from "./Modals/RenameModal";
import Dropdown, { DropdownOption } from "./Modals/Frames/Dropdown";
import { compareDates, compareStrings } from "../js_utils/sorting";
import DataHandler from "../data_handling/data_handler";
import HolesModal from "./Modals/HolesModal";
import { Modals } from "../js_utils/Enums";
import CourseOptionsModal from "./Modals/CourseOptionsModal";
import BlankSpace from "./Components/BlankSpace";
import StickyDiv from "./Components/StickyDiv";
import BlueButton from "./Components/BlueButton";

const SERVER_URI = import.meta.env.VITE_SERVER_URI;

function MainPage (props) {
    const [courses, setCourses] = useState([]);
    const [currentCourse, setCurrentCourse] = useState(null);
    const [currentModal, setCurrentModal] = useState(null);
    // Using ref for state.
    // A callback is passed to a child component that depends on this value,
    // and ref allows the child to always have the current value.
    const sortCourseBy = useRef(localStorage.getItem("sortCoursesBy") || "Alphabetical");
    const sortByDropdownRef = useRef(null);
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
            if(sortCourseBy.current === "Alphabetical") {
                result = result.sort((a, b) => compareStrings(a.name, b.name));
            }
            else if(sortCourseBy.current === "Recently modified") {
                result = result.sort((a, b) => compareDates(b.modified, a.modified));
            }
            else if(sortCourseBy.current === "Most played") {
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

    return (
        <div className="main-page">

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
                <HolesModal course={currentCourse} onClose={submitted => submitted ? setCurrentModal(null) : setCurrentModal(Modals.COURSE_OPTIONS)}>
                    
                </HolesModal>
            }

            <h1 className="h-main">My Courses</h1>
            <div className="above-courses-container">
                <Dropdown ref={sortByDropdownRef} defaultValue={sortCourseBy.current} onChange={() => {
                    const newSortBy = sortByDropdownRef.current?.getValue();
                    if(newSortBy) {
                        localStorage.setItem("sortCoursesBy", newSortBy);
                        sortCourseBy.current = newSortBy;
                        reloadCourses();
                    }
                }}>
                    <DropdownOption value="Alphabetical">Alphabetical</DropdownOption>
                    <DropdownOption value="Recently modified">Recently modified</DropdownOption>
                    <DropdownOption value="Most played">Most played</DropdownOption>
                </Dropdown>
            </div>
            {courses.length > 0
            ? // If there are courses, show courses
                <div className="courses-div">
                    {courses.map(course => {
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
                    <BlankSpace height="200px"></BlankSpace>
                </div>
            :   // If there are 0 courses, show a message saying there
                // are no courses
                <p style={{
                    "textAlign": "center",
                    "color": "gray",
                    "margin": "25px"
                }}>You don't have any courses.</p>
            }
            <StickyDiv>
                <BlueButton onClick={() => setCurrentModal(Modals.ADD_COURSE)}>Add course</BlueButton>
            </StickyDiv>
            {currentModal === Modals.ADD_COURSE &&
                <AddCourseModal onClose={() => setCurrentModal(null)} callback={reloadCourses} className="add-course-modal"></AddCourseModal>
            }
        </div>
    );
}

export default MainPage;