import React, { useState } from "react";
import MenuModal from "./Frames/MenuModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import DateInputModal from "./DateInputModal";
import CommentModal from "./CommentModal";
import { Modals } from "../../js_utils/Enums";


const RoundOptionsModal = (props) => {

    const [currentModal, setCurrentModal] = useState(Modals.ROUND_OPTIONS);

    const onClose = () => {
        setCurrentModal(Modals.ROUND_OPTIONS);
        props.onClose();
    }

    return (
        <>
        {currentModal === Modals.ROUND_OPTIONS &&
            <MenuModal onClose={onClose}>
                <ModalTitle>Round {props.roundIndex + 1}</ModalTitle>
                <ModalButton className="w-[95%] bg-gray-dark mt-[10px] text-white" onClick={() => {
                    setCurrentModal(Modals.DATE_INPUT);
                }}>Adjust date
                </ModalButton>
                <ModalButton className="w-[95%] bg-gray-dark mt-[10px] text-white" onClick={() => {
                    setCurrentModal(Modals.COMMENTS);
                }}>Add comment</ModalButton>
                <ModalButton onClick={() => {
                    // If confirm delete, show modal first
                    if(localStorage.getItem("confirm-delete") === "true") {
                        setCurrentModal(Modals.CONFIRM_ROUND_DELETE);                
                    }
                    else {
                        props.onDeleteRound();
                    }
                }} className="w-[95%] bg-red-caution text-white mt-[10px]">Delete round</ModalButton>
            </MenuModal>
        }

        {currentModal === Modals.DATE_INPUT &&
            <DateInputModal id="round-date-field" name="round-date-field" replaceImg="back-arrow" onSubmit={props.onUpdateDate}
            onBack={() => {
                setCurrentModal(Modals.ROUND_OPTIONS);
            }}
            onClose={onClose}
        >
        </DateInputModal>
        }

        {currentModal === Modals.COMMENTS &&
            <CommentModal id="round-comments-field" name="round-comments-field" replaceImg="back-arrow" onSubmit={props.onUpdateComments}
                onBack={() => {
                    setCurrentModal(Modals.ROUND_OPTIONS);
                }}
                onClose={onClose}
                initialValue={props.round.comments}>
            </CommentModal>
        }

        {currentModal === Modals.CONFIRM_ROUND_DELETE &&
            <ConfirmDeleteModal replaceImg="back-arrow" modalTitle={`Delete Round ${props.roundIndex + 1}?`}
                onSubmit={props.onDeleteRound}
                onBack={() => {
                    setCurrentModal(Modals.ROUND_OPTIONS);
                }}
                onClose={onClose}
            >
            </ConfirmDeleteModal>
        }
        </>
    );
}

export default RoundOptionsModal;