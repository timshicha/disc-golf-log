import React, { useEffect, useState } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { getAllCourses } from "../data_handling/course";
import Course from "./CourseComponents/Course";
import CourseSlot from "./CourseComponents/CourseSlot";

function LogComponent() {

    const [courses, setCourses] = useState([]);
    // By default, no course is selected, so show list of courses
    const [selectedCourse, setSelectedCourse] = useState(null);
    useEffect(() => {
        reloadCourses();
    }, []);

    const reloadCourses = () => {
        getAllCourses().then(result => setCourses(result));
    }

    return (
        <>
            {selectedCourse
            ? // If a course is selected, show the course
                <Course onBackClick={() => {setSelectedCourse(null)}} course={selectedCourse}></Course>
            : // If no course selected, show list of courses
                <>
                <AddCourseForm callback={reloadCourses}></AddCourseForm>
                <br ></br>
                {courses.map(course => {
                    return (
                        <CourseSlot course={course} key={course.name} onClick={() => {setSelectedCourse(course)}}></CourseSlot>
                    );
                })}
                </>
            }
        </>
    );
}

export default LogComponent;