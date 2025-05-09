import db from "../db/db_setup.mjs"

const addCourse = (userID, courseName, courseHoles) => {
    return db`INSERT INTO courses (user_id, name, holes) VALUES (${userID}, ${courseName}, ${courseHoles})`;
}

const modifyCourse = (userID, courseName, newCourseName) => {
    return db`UPDATE courses SET name = ${newCourseName}
        WHERE user_id = ${userID} AND name = ${courseName}`;
}

export { addCourse, modifyCourse };