import React, { useEffect, useState } from "react";
import TripleDotButton from "../Components/TripleDotButton";
import { isoToVisualFormat } from "../../Utilities/dates";
import ObjectTools from "../../Utilities/ObjectTools";
import DataHandler from "../../DataHandling/DataHandler";

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
                <div className="text-[10px] absolute ml-[2px] mt-[0px] text-gray-subtle">
                    {props.holeabel}
                </div>
                <div className={"w-[100%] p-[0px] m-[0px] h-[35px] text-[20px] text-center border-[1px] border-solid border-[#cccccc] " + averageValueBackgroundClass}>
                    {props.averageValue}
                </div>
            </div>
        </div>
    );
}

const RoundSummary = (props) => {

    const [lowestValues, setLowestValues] = useState(new Array(props.course.holes).fill(1000000));
    const [averageValues, setAverageValues] = useState(new Array(props.course.holes).fill(0));
    const [highestValues, setHighestValues] = useState(new Array(props.course.holes).fill(-1000000));

    useEffect(() => {
        calculateValues();
    }, [props.rounds]);

    const calculateValues = () => {
        const newLowestValues = new Array(props.course.holes).fill(1000000);
        const newHighestValues = new Array(props.course.holes).fill(-1000000);
        // For calculating new averages
        const totalValues = new Array(props.course.holes).fill(0);
        const newAverageValues = new Array(props.course.holes).fill(0);
        console.log(props.rounds)
        // Go through each round
        for (let i = 0; i < props.rounds.length; i++) {
            // Go through each hole
            for (let j = 0; j < props.course.holes; j++) {
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
            newAverageValues[j] = (totalValues[j] / props.rounds.length).toFixed(1);
        }
        setLowestValues(newLowestValues);
        setHighestValues(newHighestValues);
        setAverageValues(newAverageValues);
    }

    return (
        <div className="mt-[15px] font-bold w-[100%]">
            <div className="text-[16px] text-gray-normal w-[98%]">Summary</div>
            <div className="inline-block w-full">
                <div className="w-[98%] flex flex-wrap justify-start">
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