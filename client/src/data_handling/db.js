import Dexie from "dexie";

const db = new Dexie("BogeyPad");
db.version(1).stores({
    courses: "&courseUUID, name, holes, numberOfRounds",
    rounds: "&roundUUID, courseUUID, score",
    addCourseQueue: "&courseUUID, name, holes, modified",
    deleteCourseQueue: "&courseUUID",
    modifyCourseQueue: "&courseUUID, name, holes, modified",
    addRoundQueue: "&roundUUID, courseUUID",
    deleteRoundQueue: "&roundUUID, courseUUID",
    modifyRoundQueue: "&roundUUID, courseUUID, score"
});

export default db;