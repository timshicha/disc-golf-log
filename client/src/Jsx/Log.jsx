import React, { useEffect, useState, useRef } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { deleteCourse, getAllCourses, renameCourse, updateRoundCounts } from "../data_handling/course";
import Course from "./CourseComponents/Course";
import CourseSlot from "./CourseComponents/CourseSlot";
import "../css/general.css";
import MenuModal from "./Modals/Frames/MenuModal";
import ModalButton from "./Modals/ModalComponents/ModalButton";
import ModalTitle from "./Modals/ModalComponents/ModalTitle";
import RenameModal from "./Modals/RenameModal";
import Dropdown from "./Modals/Frames/Dropdown";
import DropdownOption from "./Modals/ModalComponents/DropdownOption";
import { compareDates, compareStrings } from "../js_utils/sorting";
import GoogleLoginButton from "./Components/GoogleLoginButton";


function LogComponent() {
    const [courses, setCourses] = useState([]);
    // By default, no course is selected, so show list of courses
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showOptionsCourse, setShowOptionsCourse] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    // Using ref for state.
    // A callback is passed to a child component that depends on this value,
    // and ref allows the child to always have the current value.
    const sortCourseBy = useRef(localStorage.getItem("sortCoursesBy") || "Alphabetical");

    const sortByDropdownRef = useRef(null);
    const renameModalRef = useRef(null);

    // Reload (load) on initial render
    // Reload when selected course changes (if user goes back a page)
    useEffect(() => {
        // If calculations for rounds per course haven't been made
        if(!localStorage.getItem("updatedRoundCounts")) {
            updateRoundCounts().then(() => {
                localStorage.setItem("updatedRoundCounts", Date ());
                reloadCourses();
            });
        }
        else {
            reloadCourses();
        }
    }, [selectedCourse]);

    const reloadCourses = () => {
        getAllCourses().then(result => {
            // If sort alphabetically
            if(sortCourseBy.current === "Alphabetical") {
                result = result.sort((a, b) => compareStrings(a.name, b.name));
            }
            else if(sortCourseBy.current === "Recently modified") {
                result = result.sort((a, b) => compareDates(b.modified, a.modified));
            }
            else if(sortCourseBy.current === "Most played") {
                // Update round counts
                result = result.sort((a, b) => compareStrings(b.rounds, a.rounds));
            }
            setCourses(result);
        });
    }

    const handleRenameCourse = (event) => {
        event.preventDefault();
        const oldName= showOptionsCourse.name;
        const newName = event.target.name.value;
        showOptionsCourse.name = newName;
        renameCourse(showOptionsCourse, newName).then(result => {
            // Update change in cloud
            fetch("http://localhost:3000/course", {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: oldName,
                    newName: newName
                })
            })
            // If rename successful
            setShowRenameModal(false);
            // Also close options modal
            setShowOptionsCourse(null);
            // Reload courses (order of courses may need to change)
            reloadCourses();
        }).catch(error => {
            console.log(error);
        });
    }

    return (
        <>
            <GoogleLoginButton></GoogleLoginButton>
            {showRenameModal ?
                <RenameModal onSubmit={handleRenameCourse} onClose={() => setShowRenameModal(false)} defaultValue={showOptionsCourse.name} ref={renameModalRef}>
                    <ModalTitle>Rename</ModalTitle>
                </RenameModal> :
                <>
                {showOptionsCourse ?
                    <MenuModal onClose={() => {setShowOptionsCourse(null)}}>
                        <ModalTitle>{showOptionsCourse.name}</ModalTitle>
                        <ModalButton onClick={() => {
                            setShowRenameModal(true);
                        }} className="full-width black-text gray-background">Rename
                        </ModalButton>                    
                        <ModalButton onClick={() => {
                            deleteCourse(showOptionsCourse);
                            // Update the list of courses
                            setCourses(courses.filter((course, _) => course.id !== showOptionsCourse.id));
                            setShowOptionsCourse(null);
                        }} className="full-width caution-button">Delete
                        </ModalButton>
                    </MenuModal> : null
                }
                </>
            }
            <>
            {selectedCourse
            ? // If a course is selected, show the course
                <Course onBackClick={() => {setSelectedCourse(null)}} course={selectedCourse}></Course>
            : // If no course selected, show list of courses
                <>
                <h1 className="h-main">My Courses</h1>
                <Dropdown ref={sortByDropdownRef} defaultValue={sortCourseBy.current} className="reorder-courses-dropdown" onChange={() => {
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
                {courses.length > 0
                ? // If there are courses, show courses
                    <>
                    {courses.map(course => {
                        return (
                            <CourseSlot course={course}
                                key={course.name}
                                rounds={course.rounds}
                                onClick={() => {
                                    setSelectedCourse(course);
                                }}
                                onOpenOptionsList = {() => {
                                    setShowOptionsCourse(course);
                                }}>
                            </CourseSlot>
                        );
                    })}
                    </>
                :   // If there are 0 courses, show a message saying there
                    // are no courses
                    <p style={{
                        "textAlign": "center",
                        "color": "gray",
                        "margin": "25px"
                    }}>You don't have any courses.</p>
                }
                <AddCourseForm callback={reloadCourses}></AddCourseForm>
                </>
            }
            </>
        </>
    );
}

export default LogComponent;