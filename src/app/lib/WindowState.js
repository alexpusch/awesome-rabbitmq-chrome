class WindowState {
  constructor(windowLength) {
    this.windowLength = windowLength;
    this.window = [];
  }

  addDataPoint(data) {
    this.window.push(data);
    if (this.window.length > this.windowLength) this.window.shift(-1);
  }

  getWindow() {
    return this.window;
  }
}

export default WindowState;
