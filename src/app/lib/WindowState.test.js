import WindowState from "./WindowState";
import sinon from "sinon";
import test from "ava";
import TimeConsts from "../lib/TimeConsts";

const { SECOND, MINUTE } = TimeConsts;

const setupTestWindow = () => {
  return new WindowState(10 * MINUTE);
};

const setupClock = () => sinon.useFakeTimers(0);

test.beforeEach(t => {});

test("return average in window time frame", t => {
  const windowState = setupTestWindow();
  const clock = setupClock();

  windowState.addDataPoint({ val: 10 });
  clock.tick(10 * SECOND);

  windowState.addDataPoint({ val: 1 });
  clock.tick(51 * SECOND);

  windowState.addDataPoint({ val: 5 });

  t.is(windowState.getAverage(MINUTE, d => d.val), 3);
});
