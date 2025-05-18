import Dexie from "dexie";
import DataHandler from "./data_handler";
import { v4 as uuidv4 } from "uuid";

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

            // For each round
            for (let i = 0; i < rounds.length; i++) {
                // Assign each round a roundUUID
                const roundUUID = uuidv4();
                rounds[i].roundUUID = roundUUID;
                rounds[i].data = {};
            }

            // Display courses and rounds
            console.log(courses);
            console.log(rounds);

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

