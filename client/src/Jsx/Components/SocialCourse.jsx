import React, { useEffect, useState } from "react";
import { httpGetUserCourse } from "../../ServerCalls/profile.mjs";

const SocialCourse = (props) => {

    const [rounds, setRounds] = useState([]);

    // Try to load the rounds
    useEffect(() => {
        httpGetUserCourse(props.username, props.course.courseuuid).then(result => {
            console.log(result);
        }).catch(error => {
            console.log(error);
        });
        // Get the rounds of a user
    }, []);

    return (
        <div>
            Course name: {props.course.name}
        </div>
    )
};

export default SocialCourse;