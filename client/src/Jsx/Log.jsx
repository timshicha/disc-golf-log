import React, { useEffect, useState } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { deleteCourse, getAllCourses, renameCourse } from "../data_handling/course";
import Course from "./CourseComponents/Course";
import CourseSlot from "./CourseComponents/CourseSlot";
import "../css/general.css";
import OptionsList from "./OptionsList/OptionsList";
import OptionsListButton from "./OptionsList/OptionsListButton";
import OptionsListTitle from "./OptionsList/OptionsListTitle";
import RenameModal from "./CourseComponents/RenameModal";

function LogComponent() {
    const [courses, setCourses] = useState([]);
    // By default, no course is selected, so show list of courses
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [showOptionsCourse, setShowOptionsCourse] = useState(null);
    const [showRenameModal, setShowRenameModal] = useState(false);
    useEffect(() => {
        reloadCourses();
    }, []);

    const reloadCourses = () => {
        getAllCourses().then(result => setCourses(result));
    }

    const handleRenameCourse = (event) => {
        event.preventDefault();
        const newName = event.target.name.value;
        showOptionsCourse.name = newName;
        renameCourse(showOptionsCourse, newName);
        setShowRenameModal(false);
        // Also close options modal
        setShowOptionsCourse(null);
    }

    return (
        <>
            {showRenameModal ?
                <RenameModal onSubmit={handleRenameCourse} onClose={() => setShowRenameModal(false)}>
                    <OptionsListTitle>Rename</OptionsListTitle>
                </RenameModal> :
                <>
                {showOptionsCourse ?
                    <OptionsList onClose={() => {setShowOptionsCourse(null)}}>
                        <OptionsListTitle>{showOptionsCourse.name}</OptionsListTitle>
                        <OptionsListButton onClick={() => setShowRenameModal(true)} className="full-width black-text"
                            onChange={(event) => {
                                setRenameModalInputValue(event.target.value);
                        }}>Rename
                        </OptionsListButton>                    
                        <OptionsListButton className="full-width black-text" onClick={() => {
                            alert("This feature is under construction!");
                        }}>
                            Adjust date
                        </OptionsListButton>
                        <OptionsListButton onClick={() => {
                            deleteCourse(showOptionsCourse);
                            // Update the list of courses
                            setCourses(courses.filter((course, _) => course.id !== showOptionsCourse.id));
                            setShowOptionsCourse(null);
                        }} className="full-width caution-button">Delete
                        </OptionsListButton>
                    </OptionsList> : null
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
                {courses.length > 0
                ? // If there are courses, show courses
                    <>
                    {courses.map(course => {
                        return (
                            <CourseSlot course={course}
                                key={course.name}
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