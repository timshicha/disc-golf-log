import React, { useState, useRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import ObjectTools from "../../js_utils/ObjectTools";
import DataHandler from "../../data_handling/data_handler";

class HoleModalInput extends React.Component {
    constructor (props) {
        super(props);
        this.props = props;
        this.state = {
            inputValue: props.value || ""
        }
    }
    onChange = (event) => {
        this.setValue(event.target.value);
    }

    setValue = (newValue) => {
        this.setState({ inputValue: newValue });
    }

    getValue = () => {
        return this.state.inputValue;
    }

    render = () => {
        return (
            <>
                <input className="hole-label-input" value={this.state.inputValue} onChange={event => this.onChange(event)}></input>
            </>
        );
    }
}

const HolesModal = (props) => {

    const labelRefs = useRef([]);

    // Reset the labels back to 1, 2, 3, ...
    const resetLabels = () => {
        for(let i = 0; i < labelRefs.current.length; i++) {
            labelRefs.current[i].setValue(i + 1);
        }
    }

    // Apply the new labels to the course.
    // When rounds are displayed, these labels will be
    // shown.
    const applyLabels = (event) => {
        event.preventDefault();
        const holes = Number(props.course.holes);
        const newLabels = Array(holes);
        for (let i = 0; i < holes; i++) {
            newLabels[i] = labelRefs.current[i].getValue();
        }
        console.log(newLabels);
        props.course.holeLabels = newLabels;
        DataHandler.modifyCourse(props.course);
        // Pass true because the form was submitted.
        // This will close all modals
        props.onClose(true);
    }

    return (
        <FormModal onClose={() => props.onClose(false)} onSubmit={applyLabels}>
            <ModalTitle>Modify holes</ModalTitle>
            <div className="hole-label-input-container">
            {
                ObjectTools.getCourseHoleLabels(props.course).map((label, index) => {
                    return <HoleModalInput ref={element => labelRefs.current[index] = element} value={label} key={index}></HoleModalInput>;
                })
            }
            </div>


            <div>
                <ModalButton className="half-width-button mx-5 gray-background" type="button" onClick={() => {
                    resetLabels();
                }}>
                    Reset
                </ModalButton>
                <ModalButton className="half-width-button mx-5 blue-background">Apply</ModalButton>
            </div>
        </FormModal>
    );
}

export default HolesModal;