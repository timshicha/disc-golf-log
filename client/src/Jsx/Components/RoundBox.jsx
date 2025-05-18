import React from "react";
import "../../css/round.css";

class RoundBox extends React.Component {
    constructor (props) {
        super();

        this.state = {
            value: ""
        }
        this.onChange = props.onChange;
        this.index = props.index;
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
        console.log(this.backgroundClass)
        return (
            <div className="round-box">
                <div style={{
                    position: "relative"
                }}>
                    <div style={{
                        position: "absolute",
                        zIndex: "1",
                        marginLeft: "2px",
                        marginTop: "0px",
                        color: "#aaaaaa",
                    }} className="small-text">
                        {this.index}
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

export default RoundBox;