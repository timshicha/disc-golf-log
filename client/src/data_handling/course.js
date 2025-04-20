import db from "../db";

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

export { addCourse, getCourseByName, getAllCourses };