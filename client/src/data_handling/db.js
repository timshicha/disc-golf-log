import Dexie from "dexie";

const db = new Dexie("BogeyPad");
db.version(1).stores({
    courses: "&courseUUID, name, holes, numberOfRounds, modified",
    rounds: "&roundUUID, courseUUID, date, score",
    addCourseQueue: "&courseUUID, name, holes, modified",
    deleteCourseQueue: "&courseUUID",
    modifyCourseQueue: "&courseUUID, name, holes, modified",
    addRoundQueue: "&roundUUID, courseUUID, date, score",
    deleteRoundQueue: "&roundUUID, courseUUID",
    modifyRoundQueue: "&roundUUID, courseUUID, date, score"
});

export default db;