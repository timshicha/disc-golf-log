import { dateToFormattedString } from "../js_utils/formatting";
import db from "./db";

// Add round to course
const addRound = (round) => {
    // Update the course "modified" time
    return db.courses.get(round.courseUUID).then(course => {
        if(course) {
            course.modified = Date();
            course.rounds++;
            return db.courses.put(course).then(() => {
                return db.rounds.add({
                    roundUUID: round.roundUUID,
                    courseUUID: round.courseUUID,
                    score: new Array(parseInt(round.holes)).fill(""),
                    date: dateToFormattedString(new Date())
                }).then(() => {
                    return round.roundUUID;
                });
            });
        }
        // If course isn't found
        else {
            return Promise.reject(new Error("Can't add round to non-existant course."));
        }
    });
}

const getCourseRounds = (courseUUID) => {
    return db.rounds.where("courseUUID").equals(courseUUID).toArray();
}

const replaceRoundScore = (round, newScore) => {
    db.rounds.update(round.roundUUID, {
        score: newScore
    });
    // Update the course "modified" time
    db.courses.update(round.courseUUID, {
        modified: Date ()
    });
}

const updateRound = (round) => {
    return db.rounds.update(round.roundUUID, {
        score: round.score,
        date: round.date
    }).then(() => {
        // Update the course "modified" time
        return db.courses.update(round.courseUUID, {
            modified: Date ()
        });
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
    db.rounds.delete(round.roundUUID);
    // Update the course "modified" time
    return db.courses.where("courseUUID").equals(round.courseUUID).modify(course => {
        course.modified = Date ();
        if(course.rounds) course.rounds--;
    });
};

const deleteRoundsByCourseUUID = (courseUUID) => {
    db.rounds.where("courseUUID").equals(courseUUID).delete();
}

export { addRound, getCourseRounds, replaceRoundScore, updateRound, getRoundTotal, deleteRound, deleteRoundsByCourseUUID };