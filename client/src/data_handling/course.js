import db from "./db";
import { deleteRoundsByCourseUUID } from "./round";

// Add a course to Dexie
const addCourse = (course) => {
    // Don't allow duplicates
    console.log(course)
    return db.courses.get(course.courseUUID).then(result => {
        // Don't allow duplicate course IDs
        if(result) {
            return new Promise((resolve, reject) => {
                reject("A course with this UUID already exists!");
            });
        }
        return db.courses.add({
            courseUUID: course.courseUUID,
            name: course.name,
            holes: course.holes,
            modified: Date (),
            rounds: 0
        });
    });
}

const getCourseByUUID = (courseUUID) => {
    return db.courses.get(courseUUID);
}

const getAllCourses = () => {
    return db.courses.toArray();
}

const renameCourse = (courseUUID, newName) => {
    return db.courses.update(courseUUID, {
        name: newName,
        modified: Date ()
    });
}

const deleteCourse = (course) => {
    // Delete all rounds for this course
    deleteRoundsByCourseUUID(course.courseUUID);
    return db.courses.delete(course.courseUUID).then(() => {
        return courseUUID;
    })
}

// Find the number of times each course was played
const updateRoundCounts = () => {
    const courses = {};
    // Go through each round
    return db.rounds.each((round) => {
        const courseUUID = round.courseUUID;
        // If course was already added to dict, just add to it
        if(courses[courseUUID]) {
            courses[courseUUID]++;
        }
        // Otherwuse add the course
        else {
            courses[courseUUID] = 1;
        }
    }).then(async () => {
        // Now go through each course and update it
        await db.courses.toCollection().modify(course => {
            course.numberOfRounds = courses[course.courseUUID] || 0;
        });
    });
}

export { addCourse, getCourseByUUID, getAllCourses, renameCourse, deleteCourse, updateRoundCounts };