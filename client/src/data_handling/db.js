import Dexie from "dexie";

const db = new Dexie("BogeyPad");
db.version(1).stores({
    courses: "&courseUUID, name, holes, numberOfRounds",
    rounds: "&roundUUID, courseUUID, score",
    addCourseQueue: "&courseUUID, name, holes",
    deleteCourseQueue: "&courseUUID",
    renameCourseQueue: "&courseUUID, name",
    addRoundQueue: "&roundUUID, courseUUID",
    deleteRoundQueue: "&roundUUID",
    modifyRoundQueue: "&roundUUID, score"
});

export default db;