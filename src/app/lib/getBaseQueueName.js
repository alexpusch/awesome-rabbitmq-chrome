export default function getBaseQueueName(queueName) {
  const regex = /sharding: ([^ ]+) - rabbit.*/;
  const [, match] = queueName.match(regex) || [];
  return match ? match : queueName;
}
