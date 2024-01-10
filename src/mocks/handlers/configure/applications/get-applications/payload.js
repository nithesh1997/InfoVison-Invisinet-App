export const payload = {
  success: {
    0: [
      {
        name: "APP101",
        port: "",
        portDef: {
          id: 602,
          name: "ALL_UDP",
          type: "udp",
          startport: 0,
          endport: 0,
          ro: 0,
        },
        comment: "Hello World",
        id: 9,
      },
      {
        name: "APP101",
        port: "",
        portDef: {
          id: 603,
          name: "ALL_ICMP",
          type: "icmp",
          startport: 0,
          endport: 0,
          ro: 0,
        },
        comment: "Hello World",
        id: 9,
      },
    ],
  },
  failure: {
    error: "error.get.restclient",
    errorMessage: "Error: Something went wrong...",
  },
};
