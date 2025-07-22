import React from "react";
import MenuModal from "./Frames/MenuModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";

const ConfirmModal = (props) => {

    return (
        <MenuModal replaceImg={props.replaceImg} onClose={props.onClose} onBack={() => {
            if(props.onBack) {
                props.onBack();
            }
            else {
                props.onClose();
                console.log("on close")
            }
        }}>
            <ModalTitle>{props.modalTitle || "Confirm"}</ModalTitle>
            <ModalButton className="w-[45%] bg-gray-dark text-white m-[5px]" onClick={props.onBack}>Cancel</ModalButton>
            <ModalButton className="w-[45%] bg-blue-basic text-white m-[5px]" onClick={props.onSubmit}>Confirm</ModalButton>
        </MenuModal>
    );
}

export default ConfirmModal;