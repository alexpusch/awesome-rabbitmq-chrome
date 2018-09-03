import _ from "lodash";

const empty = vals => "";
const unique = vals => _.uniq(vals).join(", ");
const first = vals => {
  return vals[0];
};
const sum = vals => _.sum(vals);

export { unique, first, sum, empty };
