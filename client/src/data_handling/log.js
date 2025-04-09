import Course from "./course";

export class Log {
    constructor (courses) {
        this.courses = {};
        if(courses) {
            this.courses = courses;
        }
        // Otherwise, read from local storage, if courses.json exists
        else {
            if(localStorage.getItem("courses.json")) {
                const coursesJson = localStorage.getItem("courses.json");
                const courses = JSON.parse(coursesJson);
                console.log(courses)
                this.addCourses(courses);
            }
        }
    }

    addCourse = (nameOrCourse, numberOfHoles=18) => {
        // If the name was given
        if(typeof nameOrCourse === "string") {
            // Make sure this name isn't already used
            if(this.courses[nameOrCourse]) {
                return false;
            }
        }
        // If the course was given
        else {
            // Make sure the name of the given course is
            // not already used
            if(this.courses[nameOrCourse.name]) {
                return false;
            }
        }
        let newCourse = new Course(nameOrCourse, numberOfHoles);
        this.courses[newCourse.name] = newCourse;
        // Update json of courses in localStorage
        localStorage.setItem("courses.json", JSON.stringify(this.courses));
        return newCourse;
    }

    addCourses = (dictOfNewCourses) => {
        const keys = Object.keys(dictOfNewCourses);
        for (let i = 0; i < keys.length; i++) {
            console.log("adding course");
            this.addCourse(dictOfNewCourses[keys[i]]);
        }
    }

    getCourse = (name) => {
        return this.courses[name];
    }

    getCourseNames = () => {
        return Object.keys(this.courses);
    }
}