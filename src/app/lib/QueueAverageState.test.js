import test from "ava";
import sinon from "sinon";

import QueuesAverageState from "./QueuesAverageState";

const SECOND = 1000;

const getQueueData = (queueName, publishRate, deliverRate) => ({
  name: queueName,
  message_stats: {
    publish_details: {
      rate: publishRate
    },
    deliver_details: {
      rate: deliverRate
    }
  }
});

const getQueuesData = (publishRate, deliverRate) => [
  getQueueData("queue1", publishRate, deliverRate),
  getQueueData("queue2", publishRate, deliverRate)
];

test("#getAverage returns the average stats for given time window", t => {
  const queueAverageState = new QueuesAverageState();
  const clock = sinon.useFakeTimers(0);

  queueAverageState.addDataPoint(getQueuesData(100, 100));

  clock.tick(10 * SECOND);
  queueAverageState.addDataPoint(getQueuesData(1, 1));

  clock.tick(51 * SECOND);
  queueAverageState.addDataPoint(getQueuesData(5, 7));

  t.deepEqual(queueAverageState.getAverage("queue1", 60 * SECOND), {
    publishRate: 3,
    deliverRate: 4
  });

  t.deepEqual(queueAverageState.getAverage("queue2", 60 * SECOND), {
    publishRate: 3,
    deliverRate: 4
  });
});
