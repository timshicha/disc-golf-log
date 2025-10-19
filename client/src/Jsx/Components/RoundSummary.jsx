import React, { useEffect, useState } from "react";
import TripleDotButton from "../Components/TripleDotButton";
import { isoToVisualFormat } from "../../Utilities/dates";
import ObjectTools from "../../Utilities/ObjectTools";
import DataHandler from "../../DataHandling/DataHandler";
import SmallModal from "../Modals/Frames/SmallModal";
import CloseX from "../Modals/ModalComponents/CloseX";

// Background colors for different round boxes
const RED_BG = "bg-[#ffd2d2]";
const GREEN_BG = "bg-[#d2ffd2]";
const GRAY_BG = "bg-[#e6e6e6]";

const RoundSummaryBox = (props) => {

    const [lowestValueBackgroundClass, setLowestValueBackgroundClass] = useState(props.lowestValue > 0 ? RED_BG : props.lowestValue === 0 ? GRAY_BG : props.lowestValue < 0 ? GREEN_BG : 0);
    const [averageValueBackgroundClass, setAverageValueBackgroundClass] = useState(props.averageValue > 0 ? RED_BG : props.averageValue === 0 ? GRAY_BG : props.averageValue < 0 ? GREEN_BG : 0);
    const [highestValueBackgroundClass, setHighestValueBackgroundClass] = useState(props.highestValue > 0 ? RED_BG : props.highestValue === 0 ? GRAY_BG : props.highestValue < 0 ? GREEN_BG : 0);

    useEffect(() => {
        setLowestValueBackgroundClass(props.lowestValue > 0 ? RED_BG : props.lowestValue === 0 ? GRAY_BG : props.lowestValue < 0 ? GREEN_BG : 0);
        setAverageValueBackgroundClass(props.averageValue > 0 ? RED_BG : props.averageValue === 0 ? GRAY_BG : props.averageValue < 0 ? GREEN_BG : 0);
        setHighestValueBackgroundClass(props.highestValue > 0 ? RED_BG : props.highestValue === 0 ? GRAY_BG : props.highestValue < 0 ? GREEN_BG : 0);
    }, [props]);

    return (
        <div className="flex-[0_0_auto] w-[11.1%]">
            <div className="relative">
                <div className="text-[10px] ml-[2px] mt-[0px] text-gray-subtle text-center h-[15px] truncate">
                    {props.holeLabel}
                </div>
                <div className="mx-auto w-[80%]">
                    <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + lowestValueBackgroundClass}>
                        {props.lowestValue}
                    </div>
                    <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + averageValueBackgroundClass}>
                        {props.averageValue}
                    </div>
                    <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + highestValueBackgroundClass}>
                        {props.highestValue}
                    </div>
                </div>
            </div>
        </div>
    );
}

const RoundSummary = (props) => {

    const [lowestValues, setLowestValues] = useState(new Array(props.course.holes).fill(1000000));
    const [averageValues, setAverageValues] = useState(new Array(props.course.holes).fill(0));
    const [highestValues, setHighestValues] = useState(new Array(props.course.holes).fill(-1000000));

    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        calculateValues();
    }, [props.rounds, props.rerenderCounter]);

    const calculateValues = () => {
        const newLowestValues = new Array(props.course.holes).fill(1000000);
        const newHighestValues = new Array(props.course.holes).fill(-1000000);
        // For calculating new averages
        const totalValues = new Array(props.course.holes).fill(0);
        // We need to manually keep track of how many valid scores there are for each hole
        // since some rounds may have blank scores for some holes
        const roundCount = new Array(props.course.holes).fill(0);
        const newAverageValues = new Array(props.course.holes).fill(0);
        // Go through each round
        for (let i = 0; i < props.rounds.length; i++) {
            // Go through each hole
            for (let j = 0; j < props.course.holes; j++) {
                if(!props.rounds[i].score[j] && props.rounds[i].score[j] !== 0) {
                    continue;
                }
                roundCount[j]++;
                // Get lowest
                if(parseInt(props.rounds[i].score[j]) < newLowestValues[j]) {
                    newLowestValues[j] = props.rounds[i].score[j];
                }
                // Get highest
                if(parseInt(props.rounds[i].score[j]) > newHighestValues[j]) {
                    newHighestValues[j] = props.rounds[i].score[j];
                }
                // Add to total for average calculation
                totalValues[j] += parseInt(props.rounds[i].score[j]);
            }
        }
        // Set average
        for (let j = 0; j < props.course.holes; j++) {
            // If no scores for this hole, set to -
            if(roundCount[j] === 0) {
                newLowestValues[j] = "-";
                newHighestValues[j] = "-";
                newAverageValues[j] = "-";
                continue;
            }
            newAverageValues[j] = (totalValues[j] / roundCount[j]).toFixed(1);
        }
        setLowestValues(newLowestValues);
        setHighestValues(newHighestValues);
        setAverageValues(newAverageValues);
    }

    return (
        <div className="mt-[15px] font-bold w-[98%]">
            <div>
                <div className="text-[16px] text-gray-normal inline-block mb-[5px]">Summary</div>
                <TripleDotButton className="ml-[5px] w-[10px] h-[10px] inline-block" onClick={() => setShowInfo(!showInfo)}></TripleDotButton>
                {showInfo &&
                    <div className="bg-gray-light p-[5px] pr-[40px] relative mb-[10px]">
                        <div className="inline-block align-top text-[12px]">
                            The summary below shows your personal best, average, and worst scores for each hole:
                        </div>
                        <div className="inline-block mx-[15px]">
                            <div className="w-[60px] my-[5px]">
                                <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + GREEN_BG}>
                                    Best
                                </div>
                                <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + GRAY_BG}>
                                    Average
                                </div>
                                <div className={"w-full p-[0px] m-[0px] h-[15px] text-[12px] text-center border-[1px] border-solid border-[#cccccc] leading-none " + RED_BG}>
                                    Worst
                                </div>
                            </div>
                        </div>
                        <CloseX className="float-right" onClick={() => setShowInfo(false)}></CloseX>
                    </div>
                }
            </div>
            <div className="inline-block w-full align-top">
                <div className="w-full flex flex-wrap gap-y-[10px]">
                    {averageValues.map((_, index) => {
                        return (
                            <RoundSummaryBox
                            key={index}
                            holeLabel={props.course.holeLabels[index]}
                            lowestValue={lowestValues[index]}
                            averageValue={averageValues[index]}
                            highestValue={highestValues[index]}/>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default RoundSummary;