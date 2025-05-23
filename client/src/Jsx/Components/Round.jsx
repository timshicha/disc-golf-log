import React from "react";
import TripleDotButton from "../Components/TripleDotButton";
import { isoToVisualFormat } from "../../js_utils/dates";
import ObjectTools from "../../js_utils/ObjectTools";
import DataHandler from "../../data_handling/data_handler";

class RoundBox extends React.Component {
    constructor (props) {
        super();

        this.state = {
            value: ""
        }
        this.onChange = props.onChange;
        this.holeabel = props.holeLabel;
        this.state.value = props.initialValue;
        this.backgroundClass = "";
    }

    render () {
        // Determine background color
        if(this.state.value !== "") {
            if(this.state.value > 0) {
                this.backgroundClass = "bg-[#ffd2d2]"; // Red background for +
            }
            else if(this.state.value < 0) {
                this.backgroundClass = "bg-[#d2ffd2]"; // Green background for -
            }
            else {
                this.backgroundClass = "bg-[#e6e6e6]"; // Light gray for 0
            }
        }
        else {
            this.backgroundClass = "";
        }
        return (
            <div className="flex-[0_0_auto] w-[11.1%]">
                <div className="relative">
                    <div className="text-[10px] absolute ml-[2px] mt-[0px] text-gray-subtle">
                        {this.holeabel}
                    </div>
                    <input type="number" name="scoreBox" pattern="[-]?[0-9]*[.,]?[0-9]*"
                    value={this.state.value} onChange={(self) => {
                        this.onChange(self.target.value);
                        this.setState({value: self.target.value});
                    }} className={"w-[100%] p-[0px] m-[0px] h-[35px] text-[20px] text-center border-[1px] border-solid border-[#cccccc] " + this.backgroundClass}>
                    </input>
                </div>
            </div>
        );
    }
}

class Round extends React.Component {
    constructor (props) {
        super();

        this.state = {
            total: 0,
        }
        this.props = props;
        this.onOpenModal = props.onOpenModal;
    }

    recalculateTotal = () => {
        // New total
        const total = ObjectTools.getRoundTotal(this.props.round);
        this.setState({
            total: total
        });


    }

    componentDidMount = () => {
        // On initial render, calculate total score for the round
        this.recalculateTotal();
    }

    render () {
        return (
            <div className="mt-[15px] font-bold w-[100%]">
                <div className="text-[16px] text-gray-subtle w-[98%]">
                    <div className={"min-w-[35px] inline-block text-white text-center mr-[3px] font-bold " +
                    (this.state.total < 0 ? "bg-[green]" : this.state.total === 0 ? "bg-black" : "bg-[red]")}>
                        {this.state.total > 0 ? "+" : ""}{this.state.total}
                    </div>
                    Round {this.props.index + 1}
                    <TripleDotButton className="h-[15px] float-right" onClick={() => {
                        this.onOpenModal(this.props.index);
                    }}></TripleDotButton>
                    <div className="float-right mr-[4px]">{isoToVisualFormat(this.props.round.date)}</div>
                </div>
                <div className="inline-block">
                    <div className="w-[98%] flex flex-wrap justify-start">
                        {this.props.round.score.map((scoreValue, index) => {
                            return (
                                <RoundBox onChange={(newValue) => {
                                    this.props.round.score[index] = newValue;
                                    // Update round (score)
                                    DataHandler.modifyRound(this.props.round, this.props.course, true).then(() => {
                                        this.recalculateTotal();
                                    }).catch(error => {
                                        console.log(error);
                                    });
                                }}
                                key={index}
                                initialValue={scoreValue}
                                holeLabel={this.props.course.holeLabels[index]}/>
                            );
                        })}
                    </div>
                </div>
                <div className="text-[12px] font-normal text-gray-subtle">{this.props.round.comments}</div>
            </div>
        );
    }
}

export default Round;