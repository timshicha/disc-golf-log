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
        <FormModal onSubmit={onSubmit} onClose={props.onClose}>
            <ModalTitle>Comments</ModalTitle>
            <textarea ref={textAreaRef}></textarea>
            <div className="margin-top-10">
                <ModalButton onClick={clearTextarea} className="half-width-button gray-background mx-5 white-text">Clear</ModalButton>
                <ModalButton type="submit" className="half-width-button blue-background mx-5 white-text">Submit</ModalButton>
            </div>
        </FormModal>
    )
}

export default CommentModal;