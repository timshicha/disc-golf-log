import { course } from "./course";

export class Log {
    constructor (courses) {
        this.courses = {};
        if(courses) {
            this.courses = courses;
        }
    }

    addCourse = (nameOrCourse) => {
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
        let newCourse = new course(nameOrCourse);
        this.courses[nameOrCourse] = newCourse;
        return newCourse;
    }

    getCourse = (name) => {
        return this.courses[name];
    }

    getCourseNames = () => {
        return Object.keys(this.courses);
    }
}