export const payload = {
  success: {
    id: 0,
    timeout: 3600,
    enable: 1,
    tcp_ident_tag: 1,
    alg: "HMAC-SHA-256-64",
    groups: ["LEADER", "ELDER", "MEMBER", "CHEIF"],
  },
  failure: {
    error: "error.get.restclient",
    errorMessage: "Error: Something went wrong...",
  },
};
