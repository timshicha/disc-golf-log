import db from "../data_handling/db";
// This class is a list of instructions for the server to use to
// match the user's data in the server to the data in the client.
//
// Every time a user makes a change in the client, their changes are
// added to this queue, and after x changes (or time), the list is
// sent to the server so the server can execute these changes. This
// queue is beneficial for two reasons:
// 1. To prevent calls to the server for every minor change
// 2. Users can use the app offline, and when online, their changes
//  can be synced.
//
// Order of instructions:
// 1. Creating and deleting courses should be done first
// 2. Renaming courses should be done second
// 3. Creating and deleting rounds should be done next
// 4. Modifying rounds should be done last
class ServerQueue {
    constructor () {

    }

    static addCourse = (course) => {
        return db.addCourseQueue.add(course);
    }

    // Challenges:
    // 1) If a user created a, then deleted a, result: user did nothing
    // 2) If a user renamed a->b, then deleted b, result: user deleted a
    static deleteCourse = (course) => {
        // Delete all rounds and round modifications related to this course
        return db.addRoundQueue.where("courseUUID").equals(course.courseUUID).delete().then(() => {
            return db.deleteRoundQueue.where("courseUUID").equals(course.courseUUID).delete().then(() => {
                return db.modifyRoundQueue.where("courseUUID").equals(course.courseUUID).delete().then(() => {
                    // Remove all course modifications
                    return db.modifyCourseQueue.delete(course.courseUUID).then(() => {
                        // Find if the course was added in the queue
                        return db.addCourseQueue.get(course.courseUUID).then(result => {
                            // If added in the queue, remove the add
                            if(result) {
                                return db.addCourseQueue.delete(course.courseUUID);
                            }
                            // If not added in the queue, add the delete
                            return db.deleteCourseQueue.add({ courseUUID: course.courseUUID });
                        });
                    });
                });
            });
        });
    }

    static modifyCourse = (course) => {
        // See if the course was added in the queue
        return db.addCourseQueue.get(course.courseUUID).then(result => {
            // If the course was added in the queue, modify the add
            if(result) {
                result.name = course.name;
                result.holes = course.holes;
                result.numberOfRounds = course.numberOfRounds;
                return db.addCourseQueue.put(result);
            }
            // Otherwise, see if a modification already exists
            return db.modifyCourseQueue.get(course.courseUUID).then(result => {
                // If a modification exists, modify the modification
                if(result) {
                    result.name = course.name;
                    result.holes = course.holes;
                    result.numberOfRounds = course.numberOfRounds;
                    return db.modifyCourseQueue.put(result);
                }
                // Otherwise, add the modification
                return db.modifyCourseQueue.add(course);
            });
        });
    }

    static addRound = (round, course) => {
        console.log(course)
        // Add round to queue
        return db.addRoundQueue.add(round).then(() => {
            // Also course "modified" needs to be updated
            if(course) {
                return this.modifyCourse(course);
            }
            return Promise.resolve();
        })
    }

    static deleteRound = (round, course) => {
        // Find the round if it was added in the queue
        return db.addRoundQueue.get(round.roundUUID).then(result => {
            // If added in the queue, delete the add
            if(result) {
                return db.addRoundQueue.delete(round.roundUUID);
            }
            // Otherwise, delete the modifications and add delete to queue
            return db.modifyRoundQueue.delete(round.roundUUID).then(() => {
                return db.deleteRoundQueue.add({
                    roundUUID: round.roundUUID,
                    courseUUID: round.courseUUID
                });
            });
        }).then(() => {
            // Also course "modified" needs to be updated
            if(course) {
                return this.modifyCourse(course);
            }
            return Promise.resolve();
        });
        
    }

    static modifyRound = (round) => {
        // Find the round in add queue, if exists
        return db.addRoundQueue.get(round.roundUUID).then(result => {
            // If the round was added in the queue
            if(result) {
                // Modify the add
                result.date = round.date;
                result.score = round.score;
                return db.addRoundQueue.put(result);
            }
            // Otherwise, see if there's a modify item in queue already
            return db.modifyRoundQueue.get(round.roundUUID).then(result => {
                // If there's a modify item
                if(result) {
                    result.date = round.date;
                    result.score = round.score;
                    return db.modifyRoundQueue.put(result);
                }
                // Otherwise, add a modification
                return db.modifyRoundQueue.add(round);
            });
        }).then(() => {
            // Also course "modified" needs to be updated
            if(course) {
                return this.modifyCourse(course);
            }
            return Promise.resolve();
        });
    }

    static getQueue = () => {
        return;
        const queue = {};
        return db.addCourseQueue.toArray().then(result => {
            queue.addCourseQueue = result;
            return db.deleteCourseQueue.toArray().then(result => {
                queue.deleteCourseQueue = result;
                return db.renameCourseQueue.toArray().then(result => {
                    queue.renameCourseQueue = result;
                    return db.addRoundQueue.toArray().then(result => {
                        queue.addRoundQueue = result;
                        return db.deleteRoundQueue.toArray().then(result => {
                            queue.deleteRoundQueue = result;
                            return db.modifyRoundQueue.toArray().then(result => {
                                queue.modifyRoundQueue = result;
                                return queue;
                            });
                        });
                    });
                });
            });
        });
    }
}

export default ServerQueue;