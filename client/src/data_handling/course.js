import db from "./db";
import { deleteRoundsByCourseID } from "./round";

// Add a course to Dexie
const addCourse = (name, holes) => {
    return db.courses.add({
        name: name,
        holes: holes,
        modified: Date ()
    });
}

const getCourseByName = (name) => {
    return db.courses.where("name").equals(name).first();
}

const getAllCourses = () => {
    return db.courses.toArray();
}

const renameCourse = (course, newName) => {
    db.courses.update(course.id, {
        name: newName,
        modified: Date ()
    });
    return newName;
}

const deleteCourse = (course) => {
    // Delete all rounds for this course
    deleteRoundsByCourseID(course.id);
    db.courses.delete(course.id);
    return course.id;
}

// Find the number of times each course was played
const updateRoundCounts = () => {
    const courses = {};
    // Go through each round
    return db.rounds.each((round) => {
        const courseID = round.courseID;
        // If course was already added to dict, just add to it
        if(courses[courseID]) {
            courses[courseID]++;
        }
        // Otherwuse add the course
        else {
            courses[courseID] = 1;
        }
    }).then(async () => {
        // Now go through each course and update it
        await db.courses.toCollection().modify(course => {
            course.rounds = courses[course.id] || 0;
        });
    });
}

export { addCourse, getCourseByName, getAllCourses, renameCourse, deleteCourse, updateRoundCounts };