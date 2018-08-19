import React, { Component } from "react";
import Transition from "react-transition-group/Transition";

import ColumnGroups from "./ColumnGroups";
import ColumnStateProvider from "./ColumnStateProvider";
import "./ColumnPicker.css";

const getPickableColumns = columnsGroups =>
  columnsGroups.filter(columnGroup => columnGroup.columns).map(columnGroup => ({
    Header: columnGroup.Header,
    columns: columnGroup.columns.filter(column => column.pickable)
  }));

class ColumnPicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render() {
    const onChange = (columnGroupHeader, header, event) => {
      const isChecked = event.target.checked;
      const changedColumnGroup = this.props.columns.find(
        columnGroup => columnGroup.Header === columnGroupHeader
      );
      const changedColumn = changedColumnGroup.columns.find(column => column.Header === header);
      changedColumn.show = isChecked;

      ColumnStateProvider.saveState(getPickableColumns(this.props.columns));
      this.props.onColumnChange(this.props.columns);
    };

    const pickableColumns = ColumnStateProvider.loadState(getPickableColumns(this.props.columns));

    const onOpenClick = () => {
      this.setState((prevState, props) => ({
        isOpen: !prevState.isOpen
      }));
    };

    return (
      <div className="column-picker">
        <div className="column-picker__button" onClick={onOpenClick}>
          ☰
        </div>

        <Transition in={this.state.isOpen} timeout={200}>
          {state => {
            const style = {
              transition: "height 200ms",
              overflow: "hidden"
            };

            if (state === "entering" || state === "entered") {
              style.height = "140px";
            } else {
              style.height = "0px";
            }

            return (
              <div style={style}>
                <ColumnGroups columnsGroups={pickableColumns} onChange={onChange} />
              </div>
            );
          }}
        </Transition>
      </div>
    );
  }
}

export default ColumnPicker;
