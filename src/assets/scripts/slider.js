import React from "react";

export default class Slider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value
    };
    this.changeValue = this.changeValue.bind(this);
  }

  changeValue(e) {
    this.props.handleValueChange(e.currentTarget.value);
    this.setState({
      value: e.currentTarget.value
    });
  }

  render() {
    return (
      <div className="mx-3 d-flex align-items-center w-50">
        <input
          className=""
          type="range"
          min={this.props.min}
          max={this.props.max}
          value={this.state.value}
          onChange={this.changeValue}
          style={{'--min':this.props.min,
						 "--max:":this.props.max,
						 "--val:":this.props.value+";"}}
        />
      </div>
    );
  }
}
