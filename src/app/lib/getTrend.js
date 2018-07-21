export default ({ publishRate, deliverRate }) =>
  publishRate > 0 ? (publishRate - deliverRate) / publishRate : 0;
