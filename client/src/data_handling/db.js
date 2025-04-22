import Dexie from "dexie";

const db = new Dexie("BogeyPad");
db.version(1).stores({
    courses: "++id, name",
    rounds: "++id, courseID, score"
});

export default db;