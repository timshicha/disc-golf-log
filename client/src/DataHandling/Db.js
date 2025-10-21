import Dexie from "dexie";

const oldDb = new Dexie("BogeyPadv2");
oldDb.version(2).stores({
    courses: "&courseUUID, name, holes, roundCount, modified, data, holeLabels",
    rounds: "&roundUUID, courseUUID, date, score, data, comments",
    addCourseQueue: "&courseUUID, name, holes, modified",
    deleteCourseQueue: "&courseUUID",
    modifyCourseQueue: "&courseUUID, name, holes, modified",
    addRoundQueue: "&roundUUID, courseUUID, date, score",
    deleteRoundQueue: "&roundUUID, courseUUID",
    modifyRoundQueue: "&roundUUID, courseUUID, date, score"
});

// New DB
const newDb = new Dexie("BogeyPadv3");
newDb.version(1).stores({
  courses: "&courseuuid, name, holes, roundCount, modified, data, holeLabels",
  rounds: "&rounduuid, courseuuid, date, score, data, comments",
  addCourseQueue: "&courseuuid, name, holes, modified",
  deleteCourseQueue: "&courseuuid",
  modifyCourseQueue: "&courseuuid, name, holes, modified",
  addRoundQueue: "&rounduuid, courseuuid, date, score",
  deleteRoundQueue: "&rounduuid, courseuuid",
  modifyRoundQueue: "&rounduuid, courseuuid, date, score"
});

const migrateDbToV3 = async () => {

  // Migrate COURSES
  const oldCourses = await oldDb.table("courses").toArray();
  const newCourses = oldCourses.map(c => {
    const { courseUUID, ...rest } = c; // remove old key
    return {
        ...rest,
        courseuuid: courseUUID,
    };
  });

  await newDb.table("courses").bulkAdd(newCourses);

  // Migrate ROUNDS
  const oldRounds = await oldDb.table("rounds").toArray();
  const newRounds = oldRounds.map(r => {
    const { roundUUID, courseUUID, ...rest } = r; // remove old keys
    return {
        ...rest,
        rounduuid: roundUUID,
        courseuuid: courseUUID,
    };
});


  await newDb.table("rounds").bulkAdd(newRounds);

  // ADD COURSE queue
  const oldAddCourseQueue = await oldDb.table("addCourseQueue").toArray();
  const newAddCourseQueue = oldAddCourseQueue.map(c => ({
    ...c,
    courseuuid: c.courseUUID,
  }));
  await newDb.table("addCourseQueue").bulkAdd(newAddCourseQueue);

  // DELETE COURSE queue
  const oldDeleteCourseQueue = await oldDb.table("deleteCourseQueue").toArray();
  const newDeleteCourseQueue = oldDeleteCourseQueue.map(c => ({
    ...c,
    courseuuid: c.courseUUID,
  }));
  await newDb.table("deleteCourseQueue").bulkAdd(newDeleteCourseQueue);

  // MODIFY COURSE queue
  const oldModifyCourseQueue = await oldDb.table("modifyCourseQueue").toArray();
  const newModifyCourseQueue = oldModifyCourseQueue.map(c => ({
    ...c,
    courseuuid: c.courseUUID,
  }));
  await newDb.table("modifyCourseQueue").bulkAdd(newModifyCourseQueue);

  // ADD ROUND queue
  const oldAddRoundQueue = await oldDb.table("addRoundQueue").toArray();
  const newAddRoundQueue = oldAddRoundQueue.map(r => ({
    ...r,
    rounduuid: r.roundUUID,
    courseuuid: r.courseUUID,
  }));
  await newDb.table("addRoundQueue").bulkAdd(newAddRoundQueue);

  // DELETE ROUND queue
  const oldDeleteRoundQueue = await oldDb.table("deleteRoundQueue").toArray();
  const newDeleteRoundQueue = oldDeleteRoundQueue.map(r => ({
    ...r,
    rounduuid: r.roundUUID,
    courseuuid: r.courseUUID,
  }));
  await newDb.table("deleteRoundQueue").bulkAdd(newDeleteRoundQueue);

  // MODIFY ROUND queue
  const oldModifyRoundQueue = await oldDb.table("modifyRoundQueue").toArray();
  const newModifyRoundQueue = oldModifyRoundQueue.map(r => ({
    ...r,
    rounduuid: r.roundUUID,
    courseuuid: r.courseUUID,
  }));
  await newDb.table("modifyRoundQueue").bulkAdd(newModifyRoundQueue);

  console.log("✅ Migration complete!");
}


export default newDb;
export { migrateDbToV3 };