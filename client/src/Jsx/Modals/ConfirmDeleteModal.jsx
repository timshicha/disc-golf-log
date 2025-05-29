import React from "react";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";

const ConfirmDeleteModal = (props) => {

    return (
        <MenuModal replaceImg={props.replaceImg} onClose={props.onClose} onBack={props.onBack}>
            <ModalTitle>{props.modalTitle || "Confirm Delete?"}</ModalTitle>
            <ModalButton className="w-[45%] bg-gray-dark text-white m-[5px]" onClick={props.onBack}>Cancel</ModalButton>
            <ModalButton className="w-[45%] bg-red-caution text-white m-[5px]" onClick={props.onSubmit}>Delete</ModalButton>
        </MenuModal>
    );
}

export default ConfirmDeleteModal;