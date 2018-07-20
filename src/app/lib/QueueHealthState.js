import WindowState from './WindowState';

function getHealth(queueData) {
  const publishRate = _.get(queueData, 'message_stats.publish_details.rate');
  const deliverRate =
    _.get(queueData, 'message_stats.deliver_details.rate') || 0;
  const ratio = publishRate > 0 ? deliverRate / publishRate : 1;

  return ratio;
}

class QueuesHealthState {
  constructor() {
    this.windows = {};
  }

  addDataPoint(queues) {
    queues.map(queue => {
      const { name } = queue;
      if (!this.windows[name]) this.windows[name] = new WindowState(6);
      const queueHealth = getHealth(queue);
      this.windows[name].addDataPoint(queueHealth);
    });
  }

  getWindow(queueName) {
    return this.windows[queueName].getWindow();
  }
}

export default QueuesHealthState;
