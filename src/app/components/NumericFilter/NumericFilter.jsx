import _ from "lodash";
import React from "react";
import NumericFilterEditMode from "./NumericFilterEditMode";
import NumericFilterClosedMode from "./NumericFilterClosedMode";
import "./NumericFilter.css";

class NumericFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false,
      min: undefined,
      max: undefined
    };

    this.ref = React.createRef();
  }

  render() {
    const enterEditMode = () => {
      this.setState({ edit: true });
    };

    const leaveEditMode = () => {
      this.setState({ edit: false });
    };

    const onChange = ({ min, max }) => {
      this.setState({ min, max });
      this.props.onChange({ min, max });
    };

    return (
      <div ref={this.ref} className="numeric-filter__wrapper">
        <div onMouseOver={enterEditMode} className="numeric-filter__closed-wrapper">
          <NumericFilterClosedMode min={this.state.min} max={this.state.max} />
        </div>
        <div className="numeric-filter__edit-wrapper">
          <NumericFilterEditMode
            min={this.state.min}
            max={this.state.max}
            onChange={onChange}
            onMouseOut={leaveEditMode}
            componentWidth={this.ref.current ? this.ref.current.offsetWidth : 100}
          />
        </div>
      </div>
    );
  }
}

export default NumericFilter;
