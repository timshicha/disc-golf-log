import React, { useEffect, useState } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { getAllCourses } from "./data_handling/course";
import Course from "./CourseComponents/Course";

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
                <>
                    <button onClick={() => {setSelectedCourse(null)}}>back</button>
                    <br/>
                    {selectedCourse.name}
                </>
            : // If no course selected, show list of courses
                <>
                <AddCourseForm callback={reloadCourses}></AddCourseForm>
                <br ></br>
                {courses.map(course => {
                    return (
                        <Course name={course.name} key={course.name} onClick={() => {setSelectedCourse(course)}}></Course>
                    );
                })}
                </>
            }
        </>
    );
}

export default LogComponent;