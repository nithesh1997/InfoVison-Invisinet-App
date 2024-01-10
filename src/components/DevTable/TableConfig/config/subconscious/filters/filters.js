import props from "./props";

const $ = {
  name: props.name,
  group: undefined,
  trustlevel: props.trustlevel,
  ipaddress: props.ipaddress,
  comment: props.comment,
  tcptagging: props.tcptagging,
  remotekey: props.remoteKey,
  enabled: props.enabled,
  date: props.date,
  time: props.time,
  "date-time": props.dateTime,
};

const extras = {
  dummy: {
    text: {
      contains: "something...",
    },
  },
};

export const filters = { ...$, ...extras };
