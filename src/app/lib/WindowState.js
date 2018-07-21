import _ from "lodash";

class WindowState {
  constructor(windowLength) {
    this.windowLength = windowLength;
    this.points = [];
  }

  addDataPoint(data) {
    const timestamp = new Date().getTime();
    this.points.push({ timestamp, data });
    if (this.points.length > this.windowLength) this.points.shift(-1);
  }

  getAverage(windowLengthMs, accessor) {
    const startTimestamp = new Date().getTime() - windowLengthMs;
    const pointsInWindow = this.points.filter(p => p.timestamp > startTimestamp);
    return _.meanBy(pointsInWindow, point => accessor(point.data));
  }
}

export default WindowState;
