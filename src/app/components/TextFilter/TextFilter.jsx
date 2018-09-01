import React from "react";
import "./TextFilter.css";

class TextFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: ""
    };
  }

  render() {
    const onChange = e => {
      const value = e.target.value;
      this.setState({ value });
      this.props.onChange(value);
    };

    const onClearClick = e => {
      this.setState({ value: "" });
      this.props.onChange("");
    };

    return (
      <div className="text-filter">
        <input
          onChange={onChange}
          className="text-filter__input"
          type="text"
          value={this.state.value}
          placeholder="filter"
        />
        <div className="text-filter__clear" onClick={onClearClick}>
          clear
        </div>
      </div>
    );
  }
}

export default TextFilter;
