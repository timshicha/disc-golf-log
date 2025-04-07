
export class course {
    // Allow initialization by providing course name and number
    // of holes or by providing a course object
    constructor (nameOrCourse, numberOfHoles) {
        // If a name was provided, then create blank course with
        // name and number of holes
        if(typeof nameOrCourse === "string") {
            this.name = nameOrCourse;
            this.courseID = crypto.randomUUID();
            this.numberOfHoles = numberOfHoles;
            this.rounds = []; // Names of json files
        }
        // If a round json was provided
        else {
            this.name = nameOrCourse.name;
            this.courseID = nameOrCourse.courseID;
            this.numberOfHoles = nameOrCourse.numberOfHoles;
            // Copy the names of the json files
            this.rounds = nameOrCourse.rounds;
        }
    }
}