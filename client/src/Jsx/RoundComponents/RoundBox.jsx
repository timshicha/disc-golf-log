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
        return (
            <div style={{display: "inline-block"}}>
                <div style={{
                    width: "100%",
                    fontSize: "3vw",
                    textAlign: "center"
                }}>
                    {this.index + 1}
                </div>
                <input type="number" name="scoreBox" style={{
                    width: "35px",
                    padding: "0px",
                    margin: "0px",
                    height: "35px",
                    fontSize: "20px",
                    textAlign: "center"
                }} value={this.state.value} onChange={(self) => {
                    this.onChange(self.target.value);
                    this.setState({value: self.target.value});
                }}>
                </input>
            </div>
        );
    }
}

export default RoundBox;