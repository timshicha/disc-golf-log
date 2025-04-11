
class Course {
    // Allow initialization by providing course name and number
    // of holes or by providing a course object
    constructor (nameOrCourse, numberOfHoles) {
        // If a name was provided, then create blank course with
        // name and number of holes
        if(typeof nameOrCourse === "string") {
            this.name = nameOrCourse;
            this.numberOfHoles = numberOfHoles;
            // Each round is given an integer. This integer will
            // be used in json, example: courseName_13.json.
            // New integer will always be the highest existing
            // integer + 1.
            this.rounds = [];
        }
        // If a round json was provided
        else {
            this.name = nameOrCourse.name;
            this.courseID = nameOrCourse.courseID;
            this.numberOfHoles = nameOrCourse.numberOfHoles;
            // Copy the names of the json files
            this.rounds = nameOrCourse.rounds;
        }
        this.updateJson();
    }

    updateJson = () => {
        const json = JSON.stringify({
            name: this.name,
            numberOfHoles: this.numberOfHoles,
            rounds: this.rounds
        });
        localStorage.setItem("course:" + this.name + ".json", json);
    }

    addRound = () => {
        // See if there are no rounds
        if(this.rounds.length === 0) {
            this.rounds.push(0);
        }
        // If there are rounds
        else {
            // Find the highest existing integer
            const highest = this.rounds[this.rounds.length - 1];
            this.rounds.push(highest + 1);
        }
        this.updateJson();
    }
}

export default Course;