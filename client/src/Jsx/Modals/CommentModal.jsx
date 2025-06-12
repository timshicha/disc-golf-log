import React, { useEffect, useRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalTitle from "./ModalComponents/ModalTitle";
import ModalButton from "./ModalComponents/ModalButton";


const CommentModal = (props) => {

    const textAreaRef = useRef(null);

    useEffect(() => {
        if(textAreaRef.current) {
            // Required because JS will literally put "undefined" in the
            // text box if field is empty
            if(!props.initialValue) {
                textAreaRef.current.value = "";
            }
            else {
                textAreaRef.current.value = props.initialValue;
            }
            textAreaRef.current.focus();
        }
    }, []);

    const onSubmit = (e) => {
        e.preventDefault();
        
        props.onSubmit(textAreaRef.current?.value);
    }

    const clearTextarea = (e) => {
        e.preventDefault();
        if(textAreaRef.current) {
            textAreaRef.current.value = "";
            textAreaRef.current.focus();
        }

    }

    return (
        <FormModal replaceImg={props.replaceImg} onSubmit={onSubmit} onClose={props.onClose} onBack={props.onBack}>
            <ModalTitle>Comments</ModalTitle>
            <textarea id={props.id} name={props.name} ref={textAreaRef} className="w-[90%] h-[200px]"></textarea>
            <div className="mt-[10px]">
                <ModalButton onClick={clearTextarea} className="w-[45%] bg-gray-dark mx-[5px] text-white">Clear</ModalButton>
                <ModalButton type="submit" className="w-[45%] bg-blue-basic mx-[5px] text-white">Submit</ModalButton>
            </div>
        </FormModal>
    )
}

export default CommentModal;