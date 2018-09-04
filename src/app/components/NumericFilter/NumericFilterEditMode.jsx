import React from "react";
import "./NumericFilterEditMode.css";

const NumericFilterEditMode = props => {
  const onClearClick = () => {
    props.onChange({ min: undefined, max: undefined });
  };

  const onChangeMin = e => {
    const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
    props.onChange({ min: value, max: props.max });
  };

  const onChangeMax = e => {
    const value = e.target.value === "" ? undefined : parseInt(e.target.value, 10);
    props.onChange({ min: props.min, max: value });
  };

  return (
    <div
      className="numeric-filter-edit"
      onMouseLeave={props.onMouseOut}
      style={{ width: props.componentWidth }}
    >
      <input
        className="numeric-filter-edit__input"
        type="number"
        value={_.defaultTo(props.min, "")}
        onChange={onChangeMin}
        placeholder="min"
      />
      <div className="numeric-filter__separator">to</div>
      <input
        placeholder="max"
        className="numeric-filter-edit__input"
        type="number"
        value={_.defaultTo(props.max, "")}
        onChange={onChangeMax}
      />
      <div className="numeric-filter-edit__clear" onClick={onClearClick}>
        clear
      </div>
    </div>
  );
};

export default NumericFilterEditMode;
