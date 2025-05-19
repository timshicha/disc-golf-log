import React from "react";
import TripleDotButton from "../Components/TripleDotButton";
import "../../css/general.css";
import { isoToVisualFormat } from "../../js_utils/dates";
import ObjectTools from "../../js_utils/ObjectTools";
import "../../css/round.css";
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
        this.backgroundClass = "round-box-gray-bg";
    }

    render () {
        // Determine background color
        if(this.state.value !== "") {
            if(this.state.value > 0) {
                this.backgroundClass = "round-box-red-bg";
            }
            else if(this.state.value < 0) {
                this.backgroundClass = "round-box-green-bg";
            }
            else {
                this.backgroundClass = "round-box-gray-bg";
            }
        }
        else {
            this.backgroundClass = "";
        }
        return (
            <div className="round-box">
                <div style={{
                    position: "relative"
                }}>
                    <div style={{
                        position: "absolute",
                        marginLeft: "2px",
                        marginTop: "0px",
                        color: "#aaaaaa",
                    }} className="small-text">
                        {this.holeabel}
                    </div>
                    <input type="number" name="scoreBox" pattern="[-]?[0-9]*[.,]?[0-9]*"
                        style={{
                            borderRadius: "0px",
                            width: "100%",
                            padding: "0px",
                            margin: "0px",
                            height: "35px",
                            fontSize: "20px",
                            textAlign: "center",
                            border: "1px #cccccc solid",
                    }} value={this.state.value} onChange={(self) => {
                        this.onChange(self.target.value);
                        this.setState({value: self.target.value});
                    }} className={this.backgroundClass}>
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
            // Component showing total score for the round.
            // The logic for styling it is more complicated,
            // so using a state for it.
            totalComponent: <span>(0)</span>,
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

        // Generate new total component
        let newTotalComponent;
        if(total < 0) {
            newTotalComponent = <span className="green-text">({total})</span>;
        }
        else if(total === 0) {
            newTotalComponent = <span className="black-text">(0)</span>;
        }
        else {
            newTotalComponent = <span className="red-text">(+{total})</span>
        }
        this.setState({
            totalComponent: newTotalComponent
        });
    }

    componentDidMount = () => {
        // On initial render, calculate total score for the round
        this.recalculateTotal();
    }

    render () {
        return (
            <div className="margin-top-15" style={{
                fontWeight: "bold",
                width: "100%",
            }}>
                <div className="medium-text text-color-subtle" style={{
                    width: "98%"
                }}>
                    <div style={{
                        minWidth: "35px",
                        display: "inline-block",
                        color: "white",
                        textAlign: "center",
                        margiLeft: "3px",
                        marginRight: "3px",
                        fontWeight: "bold"
                    }} className={
                        this.state.total < 0 ? "green-background" :
                        this.state.total === 0 ? "black-background" :
                        "red-background"
                    }>
                        {this.state.total > 0 ? "+" : ""}{this.state.total}
                    </div>
                    Round {this.props.index + 1}
                    <TripleDotButton style={{
                        height: "15px",
                        float: "right"
                    }} onClick={() => {
                        this.onOpenModal(this.props.index);
                    }}></TripleDotButton>
                    <div style={{
                        float: "right",
                        marginRight: "4px"
                    }}>{isoToVisualFormat(this.props.round.date)}</div>
                </div>
                <div style={{
                    display: "inline-block",
                    width: "fit-content"
                }}>
                    <div className="round-score-container">
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
                <div className="round-comments text-color-subtle">{this.props.round.comments}</div>
            </div>
        );
    }
}

export default Round;