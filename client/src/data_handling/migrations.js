import Dexie from "dexie";
import DataHandler from "./data_handler";
import { v4 as uuidv4 } from "uuid";
import { getSafeIso } from "../js_utils/dates";

const dbv1 = new Dexie("BogeyPad");
dbv1.version(1).stores({
    courses: "++id, name, holes, rounds",
    rounds: "++id, courseID, score, date"
});

// Migrate BogeyPad Dexie db from v1 to v2
export const migrate_v1_to_v2 = () => {
    let failed = false;
    // Get all courses
    return dbv1.courses.toArray().then(courses => {
        // Get all rounds
        return dbv1.rounds.toArray().then(async rounds => {
            // For each course
            for (let i = 0; i < courses.length; i++) {
                // Assign this course a UUID
                const courseUUID = uuidv4();
                courses[i].courseUUID = courseUUID;
                // Assign each round belonging to this course
                // the same courseUUID
                for (let j = 0; j < rounds.length; j++) {
                    if(rounds[j].courseID === courses[i].id) {
                        rounds[j].courseUUID = courseUUID;
                        // Also let the round point to the course
                        // as this will be required to upload to
                        // the database
                        rounds[j].course = courses[i];
                        // Other round-related things
                        rounds[j].roundUUID = uuidv4();
                        rounds[j].data = {};
                        // Old dates may be poorly formatted, and...
                        //
                        // In the old database, rounds were simply added in order
                        // by roundID. This meant that their order was preserved in
                        // the order that they were added. Since we are now sorting
                        // by time and we only have the date (no time) of the old db
                        // courses, we can't possible sort them properly off the date
                        // alone. So, we will use the order the rounds come in and
                        // just add a second to each round's date so that the order
                        // is preserved. This ensures that if a user played multiple
                        // rounds at the same course in one day, the order of the rounds
                        // is not messed up.
                        let newDate = getSafeIso(rounds[i].date);
                        // Don't let it go past 59 so things don't break.
                        // Let's hope a user didn't play over 60 times at the same course
                        // in one day.
                        let order = Math.min(j, 59);
                        const ones = order % 10;
                        order -= ones;
                        order /= 10;
                        const tens = order;
                        newDate = newDate.substring(0, newDate.length - 2) + tens + ones;
                        rounds[j].date = newDate;
                    }
                }
                // rounds is now roundCount
                // Set to 0 since it will be auto-incremembted when
                // we add the rounds
                courses[i].roundCount = 0; // courses[i].rounds;
                // Add holeLabels field
                courses[i].holeLabels = Array.from({ length: courses[i].holes }, (_, i) => i + 1);
                courses[i].data = {};
            }

            // Now add these to the new db (v2)
            for (let i = 0; i < courses.length; i++) {
                try {
                    await DataHandler.addCourse({
                        courseUUID: courses[i].courseUUID,
                        data: courses[i].data,
                        holeLabels: courses[i].holeLabels,
                        holes: courses[i].holes,
                        name: courses[i].name,
                        roundCount: courses[i].roundCount,
                        modified: courses[i].modified || Date()
                    });
                } catch(error) {
                    console.log(error);
                    failed = true;
                }
            }
            for (let i = 0; i < rounds.length; i++) {
                try {
                    await DataHandler.addRound({
                        roundUUID: rounds[i].roundUUID,
                        courseUUID: rounds[i].courseUUID,
                        date: rounds[i].date,
                        data: rounds[i].data,
                        score: rounds[i].score,
                    }, rounds[i].course);
                } catch(error) {
                    console.log(error);
                    failed = true;
                }
            }
            // If anything failed, reject the promise
            if(failed) {
                return Promise.reject("At least one item failed to be loaded to the new database!");
            }
            return Promise.resolve();
        });
    });
}

