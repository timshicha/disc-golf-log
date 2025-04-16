import { Round } from "./round";

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
        // Create the round JSON
        const round =  new Round(parseInt(this.numberOfHoles));
        const roundID = round.roundID;
        this.rounds.push(roundID);
        this.updateJson();
    }
}

export default Course;