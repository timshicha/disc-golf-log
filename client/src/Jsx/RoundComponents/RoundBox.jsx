import React from "react";

class RoundBox extends React.Component {
    constructor (props) {
        super();

        this.state = {
            value: ""
        }
        this.onChange = props.onChange;
        this.index = props.index;
        this.state.value = props.initialValue;
    }

    render () {
        // If number is above 0, add + in front
        if(this.state.value > 0) {
            let numAsString = this.state.value.toString();
            if(numAsString[0] !== "+") {
                // this.state.value = "+" + numAsString;
            }
        }
        return (
            <div style={{
                flex: "0 0 auto",
                width: "11%",
                margin: "0px",
                marginLeft: "0px",
                marginTop: "-1px"
            }}>
                <div style={{
                    position: "relative"
                }}>
                    <div style={{
                        position: "absolute",
                        zIndex: "100",
                        marginLeft: "2px",
                        marginTop: "0px",
                        fontSize: "10px",
                        color: "#aaaaaa",
                    }}>
                        {this.index + 1}
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
                    }}>
                    </input>
                </div>
            </div>
        );
    }
}

export default RoundBox;