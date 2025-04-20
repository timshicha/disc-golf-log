import React from "react";

class RoundBox extends React.Component {
    constructor (props) {
        super();

        this.state = {
            value: ""
        }
        this.onChange = props.onChange;
        this.state.value = props.initialValue;
    }

    render () {
        return (
            <input type="number" style={{
                width: "30px",
                height: "30px",
                fontSize: "25px",
                textAlign: "center"
            }} value={this.state.value} onChange={(self) => {
                this.onChange(self.target.value);
                this.setState({value: self.target.value});
            }}>
            </input>
        );
    }
}

export default RoundBox;