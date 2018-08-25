import _ from "lodash";

const empty = vals => "";
const uniqe = vals => _.uniq(vals).join(", ");
const first = vals => (vals.length == 1 ? vals[0] : "");
const sum = vals => _.sum(vals);

export { uniqe, first, sum, empty };
