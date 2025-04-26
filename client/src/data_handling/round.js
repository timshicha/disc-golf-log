import db from "./db";

// Add round to course
const addRound = (course) => {
    console.log(course);
    db.rounds.add({
        courseID: course.id,
        score: new Array(parseInt(course.holes)).fill(""),
        date: new Date()
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

const getRoundTotal = (round) => {
    let total = 0;
    for(let i = 0; i < round.score.length; i++) {
        // If the value is not a number or 0,
        // don't add anything
        const value = parseInt(round.score[i]);
        if(value) {
            total += value;
        }
    }
    return total;
}

const deleteRound = (round) => {
    db.rounds.delete(round.id);
    return round.id;
};

const deleteRoundsByCourseID = (courseID) => {
    db.rounds.where("courseID").equals(courseID).delete();
}

export { addRound, getCourseRounds, replaceRoundScore, updateRoundScore, getRoundTotal, deleteRound, deleteRoundsByCourseID };