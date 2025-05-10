import Dexie from "dexie";

const db = new Dexie("BogeyPad");
db.version(1).stores({
    courses: "++id, name",
    rounds: "++id, courseID, score",
    addCourseQueue: "++id, name, holes",
    deleteCourseQueue: "++id, name",
    renameCourseQueue: "++id, oldName, newName",
    addRoundQueue: "++id, courseID",
    deleteRoundQueue: "++id, roundID",
    modifyRound: "++id, roundID, newScore"
});

export default db;