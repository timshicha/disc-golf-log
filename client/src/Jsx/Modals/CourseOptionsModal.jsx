import React from "react";
import MenuModal from "./Frames/MenuModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import DataHandler from "../../data_handling/data_handler";
import { Modals } from "../../js_utils/Enums";

const CourseOptionsModal = (props) => {


    return (
        <MenuModal onClose={() => props.setModal(null)}>
            <ModalTitle>{props.course.name}</ModalTitle>
            <ModalButton onClick={() => props.setModal(Modals.RENAME)} className="w-[95%] text-white bg-gray-dark mt-[10px]">
                Rename course
            </ModalButton>
            <ModalButton onClick={() => props.setModal(Modals.HOLE_LABELS)}className="w-[95%] text-white bg-gray-dark mt-[10px]">
                Modify hole labels
            </ModalButton>            
            <ModalButton onClick={() => {
                // DataHandler.deleteCourse must be called before deleteCourse
                // because it depends on values still being in Dexie that are
                // deleted by deleteCoruse
                DataHandler.deleteCourse(props.course, true).then(() => {
                    props.setModal(null);
                    props.deleteCourseCallback();
                }).catch(err => console.log(err));
                // Update the list of courses
            }} className="w-[95%] bg-red-caution text-white mt-[10px]">
                Delete
            </ModalButton>
        </MenuModal>
    )
}

export default CourseOptionsModal;