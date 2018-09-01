import React, { Component } from "react";
import "./Countdown.css";

class Countdown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      pos: 0
    };
  }

  componentDidMount() {
    const loop = () => {
      const now = new Date();
      const pos = Math.min((now - this.props.startTime) / this.props.duration, 1);
      this.setState({ pos });

      this.rafHandler = window.requestAnimationFrame(loop);
    };

    loop();
  }

  componentWillUnmount() {
    window.cancelAnimationFrame(this.rafHandler);
  }

  render() {
    const width = `${this.state.pos * 100}%`;
    const style = { width };
    return (
      <div className="countdown">
        <div className="countdown__progress" style={style} />
      </div>
    );
  }
}

export default Countdown;
