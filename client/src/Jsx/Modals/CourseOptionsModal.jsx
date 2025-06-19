import React, { useState } from "react";
import MenuModal from "./Frames/MenuModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import DataHandler from "../../DataHandling/DataHandler";
import { Modals } from "../../Utilities/Enums";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const CourseOptionsModal = (props) => {

    const [currentModal, setCurrentModal] = useState(Modals.COURSE_OPTIONS);

    const deleteCourse = () => {
        // DataHandler.deleteCourse must be called before deleteCourse
        // because it depends on values still being in Dexie that are
        // deleted by deleteCoruse
        DataHandler.deleteCourse(props.course, true).then(() => {
            setCurrentModal(Modals.COURSE_OPTIONS);
            props.setModal(null);
            props.deleteCourseCallback();
        }).catch(err => console.log(err));
        // Update the list of courses
    }

    return (
        <>
        {currentModal === Modals.COURSE_OPTIONS &&
            <MenuModal
                onClose={() => props.setModal(null)}
            >
                <ModalTitle>{props.course.name}</ModalTitle>
                <ModalButton onClick={() => props.setModal(Modals.RENAME)} className="w-[95%] text-white bg-gray-dark mt-[10px]">
                    Rename course
                </ModalButton>
                <ModalButton onClick={() => props.setModal(Modals.HOLE_LABELS)}className="w-[95%] text-white bg-gray-dark mt-[10px]">
                    Modify hole labels
                </ModalButton>            
                <ModalButton onClick={() => {
                    if(localStorage.getItem("confirm-delete") === "true") {
                        setCurrentModal(Modals.CONFIRM_COURSE_DELETE);
                    }
                    else {
                        deleteCourse();
                    }
                }} className="w-[95%] bg-red-caution text-white mt-[10px]">
                    Delete
                </ModalButton>
            </MenuModal>
        }
        {currentModal === Modals.CONFIRM_COURSE_DELETE &&
            <ConfirmDeleteModal modalTitle={`Delete "${props.course.name}"?`}
            replaceImg="back-arrow"
            onSubmit={deleteCourse}
            onClose={() => setCurrentModal(null)}
            onBack={() => setCurrentModal(Modals.COURSE_OPTIONS)}
            >
            </ConfirmDeleteModal>
        }
        </>
    )
}

export default CourseOptionsModal;