import db from "../db";

// Add round to course "courseName"
const addRound = (course) => {
    db.rounds.add({
        courseID: course.id,
        score: new Array(course.holes).fill("")
    });
}

const getRoundsByCourseID = (courseID) => {
    return db.rounds.where("courseID").equals(courseID).toArray();
}

const replaceScoreByRoundID = (roundID, newScore) => {
    db.rounds.update(roundID, {
        score: newScore
    });
}

export { addRound, getRoundsByCourseID, replaceScoreByRoundID };