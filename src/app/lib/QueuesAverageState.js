import _ from "lodash";
import WindowState from "./WindowState";

const SECOND = 1000;
const MINUTE = 60 * SECOND;

class QueuesAverageState {
  constructor() {
    this.windows = {};
  }

  addDataPoint(queues) {
    queues.map(queue => {
      const { name } = queue;
      if (!this.windows[name]) this.windows[name] = new WindowState(15 * MINUTE);
      this.windows[name].addDataPoint(queue);
    });
  }

  getAverage(queueName, windowLengthMs) {
    const averagePublishRate = this.windows[queueName].getAverage(
      windowLengthMs,
      data => _.get(data, "message_stats.publish_details.rate") || 0
    );

    const averageDeliverRate = this.windows[queueName].getAverage(
      windowLengthMs,
      data => _.get(data, "message_stats.deliver_details.rate") || 0
    );

    return {
      publishRate: averagePublishRate,
      deliverRate: averageDeliverRate
    };
  }
}

export default QueuesAverageState;
