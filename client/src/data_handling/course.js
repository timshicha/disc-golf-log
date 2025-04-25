import db from "./db";
import { deleteRoundsByCourseID } from "./round";

// Add a course to Dexie
const addCourse = (name, holes) => {
    db.courses.add({
        name: name,
        holes: holes
    });
}

const getCourseByName = (name) => {
    return db.courses.where("name").equals(name).first();
}

const getAllCourses = () => {
    return db.courses.toArray();
}

const deleteCourse = (course) => {
    // Delete all rounds for this course
    deleteRoundsByCourseID(course.id);
    db.courses.delete(course.id);
    return course.id;
}

export { addCourse, getCourseByName, getAllCourses, deleteCourse };