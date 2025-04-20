import db from "../db";

// Add round to course
const addRound = (course) => {
    console.log(course);
    db.rounds.add({
        courseID: course.id,
        score: new Array(parseInt(course.holes)).fill("")
    });
}

const getCourseRounds = (course) => {
    return db.rounds.where("courseID").equals(course.id).toArray();
}

const replaceRoundScore = (round, newScore) => {
    db.rounds.update(round.id, {
        score: newScore
    });
}

const updateRoundScore = (round, index, newValue) => {
    round.score[index] = newValue;
    db.rounds.update(round.id, {
        score: round.score
    });
}

export { addRound, getCourseRounds, replaceRoundScore, updateRoundScore };