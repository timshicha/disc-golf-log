import { httpRetrieveAllModifiedDataFromCloud, httpUploadQueueToCloud } from "../serverCalls/data.mjs";
import db from "./Db";
import { v4 as uuidv4 } from "uuid";

class DataHandler {

    static addCourse = (course, sendChangeToCloud=true) => {
        // If courseuuid isn't set, create one
        if(!course.courseuuid) {
            course.courseuuid = uuidv4();
        }
        // Add the course to local db
        return db.courses.add(course).then(() => {
            // Add to server queue to send to backend later
            if(sendChangeToCloud) {
                return db.addCourseQueue.add(course);
            }
            return Promise.resolve(course.courseuuid)
        });
    }

    // Challenges:
    // 1) If a user created a, then deleted a, result: user did nothing
    // 2) If a user renamed a->b, then deleted b, result: user deleted a
    static deleteCourse = (course, sendChangeToCloud=true) => {
        // Delete all rounds wuth this course ID
        return db.rounds.where("courseuuid").equals(course.courseuuid).delete().then(() => {
            // Delete course
            return db.courses.delete(course.courseuuid).then(() => {
                // Add to server queue to send to backend later
                if(sendChangeToCloud) {
                    // Delete all rounds and round modifications related to this course
                    return db.addRoundQueue.where("courseuuid").equals(course.courseuuid).delete().then(() => {
                        return db.deleteRoundQueue.where("courseuuid").equals(course.courseuuid).delete().then(() => {
                            return db.modifyRoundQueue.where("courseuuid").equals(course.courseuuid).delete().then(() => {
                                // Remove all course modifications
                                return db.modifyCourseQueue.delete(course.courseuuid).then(() => {
                                    // Find if the course was added in the queue
                                    return db.addCourseQueue.get(course.courseuuid).then(result => {
                                        // If added in the queue, remove the add
                                        if(result) {
                                            return db.addCourseQueue.delete(course.courseuuid);
                                        }
                                        // If not added in the queue, add the delete
                                        return db.deleteCourseQueue.add({ courseuuid: course.courseuuid }).then(() => {
                                            // .add returns a Promise with the id, but this is a delete function so we want
                                            // the user to receive an empty promise
                                            return Promise.resolve();
                                        })
                                    });
                                });
                            });
                        });
                    });
                }
                // If not sending to backend, return empty promise
                return Promise.resolve();
            })
        })
    }

    // This saves the current course's changes
    static modifyCourse = (course, sendChangeToCloud=true) => {
        // Modify the course
        course.modified = Date();
        return db.courses.put(course).then(() => {
            if(sendChangeToCloud) {
                // See if the course was added in the queue
                return db.addCourseQueue.get(course.courseuuid).then(result => {
                    // If the course was added in the queue, modify the add
                    if(result) {
                        return db.addCourseQueue.put(course);
                    }
                    // Otherwise, add/modify the modification
                    return db.modifyCourseQueue.put(course);
                });
            }
            return Promise.resolve(course.courseuuid);
        });
    }

    static addRound = (round, course, sendChangeToCloud=true) => {
        // If round UUID isn't set, assign one
        if(!round.rounduuid) {
            round.rounduuid = uuidv4();
        }
        // Add the round
        return db.rounds.add(round).then(() => {
            // Incremenet round count
            if(course.roundCount) {
                course.roundCount++;
            }
            else {
                course.roundCount = 1;
            }
            // Update course "modified" time
            course.modified = Date();
            // Now modify the course and propogate whether
            return this.modifyCourse(course, sendChangeToCloud).then(() => {
                // If sending change to backend
                if(sendChangeToCloud) {
                    return db.addRoundQueue.add(round);
                }
                return Promise.resolve(round.rounduuid);
            })
        });
    }

    static deleteRound = (round, course, sendChangeToCloud=true) => {
        // Delete the round
        return db.rounds.delete(round.rounduuid).then(() => {
            if(course.roundCount) {
                course.roundCount--;
            }
            course.modified = Date();
            // Update the course
            return this.modifyCourse(course, sendChangeToCloud).then(() => {
                // If also sending the change to the backend
                if(sendChangeToCloud) {
                    // Find the round if it was added in the queue
                    return db.addRoundQueue.get(round.rounduuid).then(result => {
                        // If added in the queue, delete the add
                        if(result) {
                            return db.addRoundQueue.delete(round.rounduuid);
                        }
                        // Otherwise, delete the modifications and add the delete to queue
                        return db.modifyRoundQueue.delete(round.rounduuid).then(() => {
                            return db.deleteRoundQueue.add({
                                rounduuid: round.rounduuid,
                                courseuuid: round.courseuuid
                            });
                        });
                    });
                }
            });
        });
    }

    static modifyRound = (round, course, sendChangeToCloud=true) => {
        // Modify the round
        return db.rounds.put(round).then(() => {
            // Update course modified time
            course.modified = Date();
            return this.modifyCourse(course, sendChangeToCloud).then(() => {
                // If the round was added in the queue, modify the add instead of
                // adding a modify task
                return db.addRoundQueue.get(round.rounduuid).then(result => {
                    if(result) {
                        return db.addRoundQueue.put(round);
                    }
                    // If not added in queue, modify
                    return db.modifyRoundQueue.put(round);
                });
            });
        });
    }

    static clearAllCoursesAndRounds = () => {
        return db.courses.clear().then(() => {
            return db.rounds.clear();
        });
    }

    static getCourseRounds = (course) => {
        return db.rounds.where("courseuuid").equals(course.courseuuid).sortBy("date");
    }

    static getAllCourses = () => {
        return db.courses.toArray();
    }

    // Updates each course's rounds counts by counting the rounds
    // belonging to each course
    static updateCourseRoundCounts = () => {
        // For each course, see how many rounds have this
        // course's courseuuid
        return db.transaction("rw", db.courses, db.rounds, () => {
            return db.courses.each(course => {
                return db.rounds.where("courseuuid").equals(course.courseuuid).count().then(count => {
                    course.roundCount = count;
                    return db.courses.put(course);
                });
            });
        });
    }

    static getAllData = () => {
        return db.courses.toArray().then(result => {
            const data = { courses: result };
            return db.rounds.toArray().then(result => {
                data.rounds = result;
                return data;
            });
        });
    }

    static replaceUpdateQueue = (newQueue) => {
        // Clear the update queue
        return db.addCourseQueue.clear().then(async () => {
            await db.modifyCourseQueue.clear();
            await db.deleteCourseQueue.clear();
            await db.addRoundQueue.clear();
            await db.modifyRoundQueue.clear();
            await db.deleteRoundQueue.clear();
            // Replace with the new queue
            for (let i = 0; i < newQueue.addCourseQueue.length; i++) {
                if(!newQueue.addCourseQueue[i]) continue;
                await db.addCourseQueue.put(newQueue.addCourseQueue[i]);
            }
            for (let i = 0; i < newQueue.modifyCourseQueue.length; i++) {
                if(!newQueue.modifyCourseQueue[i]) continue;
                await db.modifyCourseQueue.put(newQueue.modifyCourseQueue[i]);
            }
            for (let i = 0; i < newQueue.deleteCourseQueue.length; i++) {
                if(!newQueue.deleteCourseQueue[i]) continue;
                await db.deleteCourseQueue.put(newQueue.deleteCourseQueue[i]);
            }
            for (let i = 0; i < newQueue.addRoundQueue.length; i++) {
                console.log(newQueue.addRoundQueue[i]);
                if(!newQueue.addRoundQueue[i]) continue;
                await db.addRoundQueue.put(newQueue.addRoundQueue[i]);
            }
            for (let i = 0; i < newQueue.modifyRoundQueue.length; i++) {
                if(!newQueue.modifyRoundQueue[i]) continue;
                await db.modifyRoundQueue.put(newQueue.modifyRoundQueue[i]);
            }
            for (let i = 0; i < newQueue.deleteRoundQueue.length; i++) {
                if(!newQueue.deleteRoundQueue[i]) continue;
                await db.deleteRoundQueue.put(newQueue.deleteRoundQueue[i]);
            }
        });
    };

    static clearUpdateQueue = async () => {
        // Clear the update queue
        return db.addCourseQueue.clear().then(async () => {
            await db.modifyCourseQueue.clear();
            await db.deleteCourseQueue.clear();
            await db.addRoundQueue.clear();
            await db.modifyRoundQueue.clear();
            await db.deleteRoundQueue.clear();
        });
    }

    // Bulk add (such as when reading from cloud).
    // Changes will not be saved to the update queue or uploaded to cloud
    static bulkAdd = async (courses, rounds) => {
        console.log(courses, rounds);
        for (let i = 0; i < courses.length; i++) {
            try {
                await db.courses.put(courses[i]);
            } catch (error) {
                console.log(`Could not add course to Dexie: ${error}`)
            }
        }
        for (let i = 0; i < rounds.length; i++) {
            try {
                await db.rounds.put(rounds[i]);
            } catch (error) {
                console.log(`Could not add round to Dexie: ${error}`)
            }
        }
    }

    // Bulk modify (such as when reading from cloud).
    // Changes will not be saved to the update queue or uploaded to cloud
    static bulkModify = async (courses, rounds) => {
        // For all courses
        for (let i = 0; i < courses.length; i++) {
            // Delete if marked deleted
            if(courses[i].deleted) {
                try {
                    await db.courses.delete(courses[i].courseuuid);
                } catch (error) {
                    console.log(`Could not delete course in Dexie: ${error}`)
                }
                continue;
            }
            // Add/modify course
            else {
                try {
                    // Modify course (or add if it doesn't exist)
                    await db.courses.put(courses[i]);
                } catch (error) {
                    console.log(`Could not modify (or add) course in Dexie: ${error}`)
                }
            }
        }
        // For all rounds
        for (let i = 0; i < rounds.length; i++) {
            // Delete if marked deleted
            if(rounds[i].deleted) {
                try {
                    await db.rounds.delete(rounds[i].rounduuid);
                } catch (error) {
                    console.log(`Could not delete round in Dexie: ${error}`)
                }
                continue;
            }
            // Add/modify round
            else {
                try {
                    // Modify round (or add if it doesn't exist)
                    console.log(rounds[i]);
                    await db.rounds.put(rounds[i]);
                } catch (error) {
                    console.log(`Could not modify (or add) round in Dexie: ${error}: ${JSON.stringify(rounds[i])}`)
                }
            }
        }
    }

    // Take all the current courses and rounds and make that the update queue.
    // This will replace the current update queue. This is useful for when a user
    // logs in. We will just take whatever data they currently have locally and
    // turn it into an update queue to send to the server
    static replaceUpdateQueueWithCurrentData = async () => {
        await this.clearUpdateQueue();
        await db.courses.toArray().then(async (courses) => {
            for (let i = 0; i < courses.length; i++) {
                await db.addCourseQueue.put(courses[i]);
            }
        });
        await db.rounds.toArray().then(async (rounds) => {
            for (let i = 0; i < rounds.length; i++) {
                await db.addRoundQueue.put(rounds[i]);
            };
        });
    }

    static getQueue = () => {
        const queue = {};
        return db.addCourseQueue.toArray().then(result => {
            queue.addCourseQueue = result;
            return db.deleteCourseQueue.toArray().then(result => {
                queue.deleteCourseQueue = result;
                return db.modifyCourseQueue.toArray().then(result => {
                    queue.modifyCourseQueue = result;
                    return db.addRoundQueue.toArray().then(result => {
                        queue.addRoundQueue = result;
                        return db.deleteRoundQueue.toArray().then(result => {
                            queue.deleteRoundQueue = result;
                            return db.modifyRoundQueue.toArray().then(result => {
                                queue.modifyRoundQueue = result;
                                return Promise.resolve(queue);
                            });
                        });
                    });
                });
            });
        });
    }

    static hasChanges = async () => {
        const queue = await this.getQueue();
        // If there is something in any queue, return true
        return (queue.addCourseQueue.length > 0 ||
            queue.modifyCourseQueue.length > 0 ||
            queue.deleteCourseQueue.length > 0 ||
            queue.addRoundQueue.length > 0 ||
            queue.modifyRoundQueue.length > 0 ||
            queue.deleteRoundQueue.length > 0
        );
    }
}

// Sync changes with cloud.
// This will upload any changes in the queue to the cloud and
// download any changes from the cloud.
//
// Returns null on success, or an error string on failure.
const syncWithCloud = async () => {
    const email = localStorage.getItem("email");
    if(!email) {
        return "Failed to sync data: You are not logged in.";
    }
    let statusCode;
    try {
        // Try downloading data
        const downloadResult = await httpRetrieveAllModifiedDataFromCloud(localStorage.getItem("last-synced-with-cloud"));
        if(!downloadResult.success) {
            statusCode = downloadResult.status;
            throw new Error (downloadResult);
        }

        // Try uploading changes to cloud
        const result = await httpUploadQueueToCloud(false);
        if(!result.success) {
            statusCode = result.status;
            throw new Error (result);
        }

        // Manage the data we downloaded
        await DataHandler.bulkModify(downloadResult.data.courses, downloadResult.data.rounds);
        const date = Date ();
        localStorage.setItem("last-synced-with-cloud", date);
        return null;
    } catch (result) {
        console.log("Sync failed. Data causing failure: ", result);
        let error;
        if(statusCode === 401) {
            // Log them out so they don't try to request again
            localStorage.removeItem("email");
            localStorage.removeItem("username");
            localStorage.removeItem("last-synced-with-cloud");
            return "Failed to sync data: You are not logged in.";
        }
        else if(statusCode === 500) {
            return "Failed to sync data: A problem occured in the server.";
        }
        else if(statusCode === 404) {
            return "Failed to sync data: Bad request (not your fault).";
        }
        else if(!statusCode) {
            return "Failed to sync data: Could not connect to server.";
        }
        else {
            return "Failed to sync data.";
        }
    }
}

export default DataHandler;
export { syncWithCloud };