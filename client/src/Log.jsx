import React, { useEffect, useState } from "react";
import AddCourseForm from "./CourseComponents/AddCourseForm";
import { getAllCourses } from "./data_handling/course";

function LogComponent() {

    const [courses, setCourses] = useState([]);
    useEffect(() => {
        getAllCourses().then(result => setCourses(result));
    }, []);

    return (
        <>
            <AddCourseForm></AddCourseForm>
            {courses.map(course => course.name + ", ")}
        </>
    );
}

export default LogComponent;