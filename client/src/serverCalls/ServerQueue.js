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

    static addCourse = (name, holes) => {
        return db.addCourseQueue.add({
            name: name,
            holes: holes
        });
    }

    // Challenges:
    // 1) If a user created a, then deleted a, result: user did nothing
    // 2) If a user renamed a->b, then deleted b, result: user deleted a
    static deleteCourse = (name) => {
        // See if the course was added in the queue
        return db.addCourseQueue.where("name").equals(name).first().then(result => {
            // If the course was added in the queue, simply delete it from the queue
            if(result) {
                return db.addCourseQueue.delete(result.id);
            }
            // See if a course was renamed to this name
            return db.renameCourseQueue.where("newName").equals(name).first().then(result => {
                // If a course was renamed, remove the rename and delete original
                if(result) {
                    const oldName = result.oldName;
                    return db.renameCourseQueue.delete(result.id).then(result => {
                        return db.deleteCourseQueue.add({ name: oldName});
                    });
                }
                // If a course was not renamed, simply delete
                return db.deleteCourseQueue.add( {name: name });
            })
        });
    }

    static renameCourse = (oldName, newName) => {
        // Challenges:
        // 1) If a user created a, then renamed a-> b, result: user created b
        // 2) If a user renames a-> b, then renamed a->c, result: user renamed a->c
        //
        // First see if the user created this course in the queue
        return db.addCourseQueue.where("name").equals(oldName).first().then(result => {
            // If the user created it in this queue, modify the creation
            if(result) {
                return db.addCourseQueue.update(result.id, { name: newName });
            }
            // See if the user already renamed this course in the queue
            // If new old name is the old new name (reading this can cause a
            // stroke... basically, the line below IS suppsed to be 
            // ...where("newName").equals(oldName)... even though it may look weird)
            return db.renameCourseQueue.where("newName").equals(oldName).first().then(result => {
                // If already renamed once, modify renaming
                if(result) {
                    return db.renameCourseQueue.update(result.id, { newName: newName });
                }
                // If not renamed, add the rename to the queue
                return db.renameCourseQueue.add({
                    oldName: oldName,
                    newName: newName
                });
            })
        });
    }

    static addRound = (courseID, roundID) => {
        return db.addRoundQueue.add({
            courseID: courseID,
            roundID: roundID
        });
    }

    static deleteRound = (roundID) => {
        // See if this round was created in the queue
        return db.addRoundQueue.where("roundID").equals(roundID).first().then(result => {
            // If the round was added in the queue, remove the add
            if(result) {
                return db.addRoundQueue.delete(result.id);
            }
            // See if the round was modified
            return db.modifyRoundQueue.where("roundID").equals(roundID).first().then(result => {
                // If the round was modified, delete the modification and
                // and add the round deletion to queue
                if(result) {
                    return db.modifyRoundQueue.delete(roundID).then(() => {
                        return db.deleteRoundQueue.add( {roundID: roundID } );
                    });
                }
                // Otherwuise just delete the round
                return db.deleteRoundQueue.add( {roundID: roundID } );
            });
        });
    }

    static modifyRound = (roundID, newScore) => {
        // See if the round was already modified
        return db.modifyRoundQueue.where("roundID").equals(roundID).first().then(result => {
            // If round was already modify, modify the modificaiton
            if(result) {
                return db.modifyRoundQueue.update(result.id, { newScore: newScore });
            }
            // Otherwise add the modification
            return db.modifyRoundQueue.add({
                roundID: roundID,
                newScore: newScore
            });
        });
    }
}

export default ServerQueue;