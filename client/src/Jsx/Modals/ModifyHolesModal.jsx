import React, { useRef } from "react";
import FormModal from "./Frames/FormModal";
import ModalButton from "./ModalComponents/ModalButton";
import ModalTitle from "./ModalComponents/ModalTitle";
import ObjectTools from "../../Utilities/ObjectTools";
import DataHandler from "../../DataHandling/DataHandler";

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
            <input className="w-[10px] m-[1%] mt-[10px] flex-[0_0_18%] box-border" name={this.props.name} id={this.props.id} value={this.state.inputValue} onChange={event => this.onChange(event)}></input>
        );
    }
}

const ModifyHolesModal = (props) => {

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
        props.course.holeLabels = newLabels;
        DataHandler.modifyCourse(props.course);
        // Pass true because the form was submitted.
        // This will close all modals
        props.onClose(true);
    }

    return (
        <FormModal replaceImg={props.replaceImg}
            onClose={props.onClose}
            onBack={props.onBack}
            onSubmit={applyLabels}>
            <ModalTitle>Modify holes</ModalTitle>
            <div className="flex flex-wrap justify-start mb-[15px]">
            {
                ObjectTools.getCourseHoleLabels(props.course).map((label, index) => {
                    return <HoleModalInput name={`hole-${index}-label-field`} id={`hole-${index}-label-field`} ref={element => labelRefs.current[index] = element} value={label} key={index}></HoleModalInput>;
                })
            }
            </div>


            <div>
                <ModalButton className="w-[45%] mx-[5px] bg-gray-dark text-white" type="button" onClick={() => {
                    resetLabels();
                }}>
                    Reset
                </ModalButton>
                <ModalButton className="w-[45%] mx-[5px] bg-blue-basic text-white">Apply</ModalButton>
            </div>
        </FormModal>
    );
}

export default ModifyHolesModal;