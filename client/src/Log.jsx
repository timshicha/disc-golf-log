import React, { useEffect, useState } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { getAllCourses } from "./data_handling/course";

function LogComponent() {

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        reloadCourses();
    }, []);

    const reloadCourses = () => {
        getAllCourses().then(result => setCourses(result));
    }

    return (
        <>
            <AddCourseForm callback={reloadCourses}></AddCourseForm>
            {courses.map(course => course.name + ", ")}
        </>
    );
}

export default LogComponent;