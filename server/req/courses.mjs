import db from "../db/db_setup.mjs"

const addCourse = (userID, courseName, courseHoles) => {
    return db`INSERT INTO courses (user_id, name, holes) VALUES (${userID}, ${courseName}, ${courseHoles})`;
}

export { addCourse };